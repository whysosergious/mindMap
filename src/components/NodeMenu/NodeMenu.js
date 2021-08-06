import { _gc, _presetNodes, _data } from '/gc.js';

/** Context menu component */
export default {
  props: {
    x: Number,
    y: Number,
    show: Boolean,
    addNode: Function,
    cz: Number
  },
  data() {
    return {
      altClass: null,
      presetNodes: _presetNodes,
      activeTab: 'web'
    }
  },
  template: await _gc.getTemplate('NodeMenu', true),
  computed: {
    mousePos() {
      this.altClass = this.$props.show ? 'show' : null;
      return this.$props.y + this.$props.x === 0 ? null : `top: ${ this.$props.y }px; left: ${ this.$props.x }px;`;
    }
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    pickNode(ev, node) {
      let el = ev.currentTarget,
        elRect = el.getBoundingClientRect(),
        clone = el.cloneNode(true);

      viewport.appendChild(clone);
      clone.classList.add('clone');
      setTimeout(()=>{
        clone.classList.add('dragging');
      },10);

      if (!/canvas|section/.test(node)) {
        clone.style.height = `5rem`;
        clone.style.width = `5rem`;
      } else {
        clone.style.height = `10rem`;
        clone.style.width = `8rem`;
      }
      clone.style.transform = `translate3d(${ elRect.x }px, ${ elRect.y }px, 0)`;
      clone.z = 100;
      // this can be shortened, but more understandable what's going on this way
      // clone.mods = {
      //   multiplier: Math.floor(_gc.viewport.perspective / 100),
      //   shortLow: 1 - clone.z / _gc.viewport.perspective,
      //   shortHigh: 1 + clone.z / _gc.viewport.perspective,
      //   longLow: (val) => val * (1 - clone.z / _gc.viewport.perspective) / (_gc.viewport.perspective / 100) * (1 - clone.z / _gc.viewport.perspective),
      //   longHigh: (val) => val * (1 + clone.z / _gc.viewport.perspective) / (_gc.viewport.perspective / 100) * (1 - clone.z / _gc.viewport.perspective)
      // }
      let perspective = _gc.viewport.perspective;
      this.lv = {
        y: 0,
        x: 0,
        oy: ev.y,
        ox: ev.x,
        ely: elRect.y,
        elx: elRect.x,

        // TODO adjust for resize and edit for precision
        // innerOffY: -(viewport.offsetHeight * .006) + ev.offsetY * (1-clone.z/perspective) + el.offsetHeight*(1+clone.z/perspective)/clone.mods.multiplier*(1+clone.z/perspective),
        // innerOffX: (-20 + (viewport.offsetWidth * .015)) + ev.offsetX * (1-clone.z/perspective) + el.offsetWidth*(1+clone.z/perspective)/clone.mods.multiplier*(1+clone.z/perspective)
      }

      // console.log(viewport.offsetWidth * .01)
      // console.log(2 + ev.offsetX * (1-clone.z/perspective) + el.offsetWidth*(1+clone.z/perspective)/clone.mods.multiplier*(1+clone.z/perspective));
      // console.log(-5 + ev.offsetY * (1-clone.z/perspective) + el.offsetHeight*(1+clone.z/perspective)/clone.mods.multiplier*(1+clone.z/perspective));

      el.classList.add('dragging');
      let handleMove = (ev)=>this.handleMove(ev, clone);
      window.addEventListener('mousemove', handleMove);
      canvas.addEventListener('mouseup', (ev)=>{
        app.classList.remove('drawing');

        let newNode;
        if (!/canvas|section/.test(node)) {
          newNode = JSON.parse(JSON.stringify(node));
          newNode.id = `ugn${ ++_data.count }`;
          newNode.h = _gc.defaults.nodes[node.type].h;
          newNode.w = _gc.defaults.nodes[node.type].w;
          newNode.linesTo = {}
          newNode.linesFrom = {}
        } else if (/canvas/.test(node)) {
          newNode = {
            type: 'web-node',
            tag: node,
            id: `webcan${ ++_data.count }`,
            h: 1200,
            w: 900,
            tree: {}
          }
        } else if (/section/.test(node)) {
          newNode = {
            type: 'web-node',
            tag: node,
            id: `websec${ ++_data.count }`,
            h: 400,
            m: 0,
            p: 0,
            gr: 2,
            gc: 3,
            tree: {}
          }
        }
        // TODO redo this is way off
        // newNode.x = ~~((ev.offsetX - this.lv.innerOffX) - ((ev.x * (1+clone.z/perspective) - ev.x) - viewport.offsetWidth*(1-clone.z/perspective)/clone.mods.multiplier*(1-clone.z/perspective)));
        // newNode.y = ~~((ev.offsetY - this.lv.innerOffY) - ((ev.y * (1+clone.z/perspective) - ev.y) - viewport.offsetHeight*(1-clone.z/perspective)/clone.mods.multiplier*(1-clone.z/perspective)));
        newNode.x = ev.offsetX,
        newNode.y = ev.offsetY,
        newNode.z = clone.z;

        this.$props.addNode(newNode, ev);
        el.classList.remove('dragging');
        clone.remove();
        window.removeEventListener('mousemove', handleMove);
      }, { once: true });
    },
    handleMove(ev, el)  {
      app.classList.add('drawing');
      let { lv } = this;
      lv.ely -= (lv.oy - ev.y) - lv.y;
      lv.elx -= (lv.ox - ev.x) - lv.x;
      lv.y = (lv.oy - ev.y);
      lv.x = (lv.ox - ev.x);

      el.style.transform = `translate3d(${ lv.elx }px, ${ lv.ely }px, 0)`;
    },
  },
  beforeMount() {
  },
  mounted() {
  }
}
