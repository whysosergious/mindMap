import { _gc, _data, _proxies } from '/gc.js';
// const { watchEffect } = Vue;

// scoped styles
// const scopedCSS = (id, vals) => `
//   [${ id }] h3 { 
//     font-size: ${ vals.fontSize }rem;
//   }
//   [${ id }].step-node { 
//     background-color: ${ vals.bg };
//   }`;

// components
import EditFrame from '/src/components/EditFrame/EditFrame.js';


/** Node component */
export default {
  props: {
    node: Object,
    bg: String,
    cz: Number,
    hooks: Object
  },
  setup(props) {
    // temp obj simulating fetched values

    
    // scoped css values
    // const cssVals = {
    //   fontSize: .8,
    //   bg: props.bg
    // }

    return {
      // meta
      props,

      // data
      mod: () => 1 - ((props.node.z + props.cz ) / (_gc.viewport.perspective / 100) / 100), // adjustment modifier for 3d perspective

      // css
      // scopedCSS, cssVals
    }
  },
  template: await _gc.getTemplate('StepNode', true),
  components: {
    EditFrame
  },
  methods: {
    handleStartResize(ev, origin) {
      // latest & original values: { coords, scroll offsets }
      this.lv = {
        y: 0,
        x: 0,
        oy: ev.y,
        ox: ev.x,
        noy: this.$props.node.y,
        nox: this.$props.node.x,
        noh: this.$props.node.h,
        now: this.$props.node.w
      }


      const handleResize = ev => {
        let { $props: { node }, mod, lv } = this;
        mod = mod();

        let y = lv.oy - ev.y,
          x = lv.ox - ev.x,
          update = false;

        if (node.w <= 400 && node.w > 50) {
          update = true;
        }
  

        if (/br|bl/.test(origin) && lv.noh - y <= 400 && lv.noh - y >= 50) {
          node.h = lv.noh - y;
        }
        if (/tr|tl/.test(origin)&& lv.noh + y <= 400 && lv.noh + y >= 50) {
          node.y = lv.noy - y;
          node.h = lv.noh + y;
        }

        if (/tl|bl/.test(origin) && lv.now + x <= 400 && lv.now + x >= 50) {
          node.x = lv.nox - x;
          node.w = lv.now + x;
        }
        if (/tr|br/.test(origin) && lv.now - x <= 400 && lv.now - x >= 50) {
          node.w = lv.now - x;
        }
          
        if (update) {
          this.updateSize();
          this.updatePos();

          Object.values(this.$props.node.linesTo).forEach(({ lineId, nodeId }) => {
            let line = _data.lines[lineId];

            line.lineTools();
            line.y = node.y + node.h/2;
            line.x = node.x + node.w/2;

            _gc.sharedMethods.calcRelPoint(line);
            line.points.length === 0 && _gc.sharedMethods.calcRelRotation(line);
          });
    
          Object.values(this.$props.node.linesFrom).forEach(({ lineId, nodeId }) => {
            let line = _data.lines[lineId];

            line.lineTools();
            line.ey = node.y + node.h/2;
            line.ex = node.x + node.w/2;

            _gc.sharedMethods.calcRelEndPoint(line); 
          });
        }
      }
      
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', (ev)=>{
        this.handleRelease(ev);
        window.removeEventListener('mousemove', handleResize);
      }, { once: true });
    },
    updateSize() {
      const { $el, $props: { node } } = this;

      $el.style.height = `${ node.h }px`;
      $el.style.width = `${ node.w }px`;
    },
    updateCss() {
      const { id, scopedCSS, cssVals } = this;
      _proxies.scopedCSS.val = { id, css: scopedCSS(id, cssVals) };
    },
    updatePos() {
      const { $el, $props: { node } } = this;

      $el.style.transform = `translate3d(${ node.x }px, ${ node.y }px, ${ node.z }px)`;
    },
    // w() {
    //   watchEffect(() => {
    //     this.props.cz;
    //   });
    // },

    // event handlers
    handleGrab(ev) {
      // latest & original values: { coords, scroll offsets }
      this.lv = {
        y: 0,
        x: 0,
        oy: ev.y,
        ox: ev.x,
        soy: 0,
        sox: 0,
        osoy: viewport.scrollTop,
        osox: viewport.scrollLeft
      }

      this.select = true;
      setTimeout(()=>{
        this.select = false;
      }, 200);
      
      window.addEventListener('mousemove', this.handleMove);
      window.addEventListener('mouseup', this.handleRelease, { once: true });
    },
    handleMove(ev)  {
      ev.preventDefault();
      let { $props: { node }, mod, lv } = this;
      mod = mod();

      node.y -= (lv.oy - ev.y)*mod - lv.y;
      node.x -= (lv.ox - ev.x)*mod - lv.x;

      Object.values(this.$props.node.linesTo).forEach(({ lineId, nodeId }) => {
        let line = _data.lines[lineId];

        if (!line)
          return;

        line.lineTools();
        line.y = node.y + node.h/2;
        line.x = node.x + node.w/2;
        line.connFrom && _gc.sharedMethods.calcRelPoint(line);
        line.connTo && _gc.sharedMethods.calcRelEndPoint(line);
        line.points.length === 0 && _gc.sharedMethods.calcRelRotation(line);
      });

      Object.values(this.$props.node.linesFrom).forEach(({ lineId, nodeId }) => {
        let line = _data.lines[lineId];

        if (!line)
          return;

        line.lineTools();
        line.ey = node.y + node.h/2;
        line.ex = node.x + node.w/2;
        line.connFrom && _gc.sharedMethods.calcRelPoint(line);
        line.connTo && _gc.sharedMethods.calcRelEndPoint(line); 
      });

      lv.y = (lv.oy - ev.y)*mod;
      lv.x = (lv.ox - ev.x)*mod;

      // console.log('o ', node.x, node.y);
      this.updatePos();
    },  
    handleRelease(ev) {
      window.removeEventListener('mousemove', this.handleMove);

      const { $props: { node } } = this;

      node.x = ~~node.x;
      node.y = ~~node.y;
      node.h = ~~node.h;
      node.w = ~~node.w;

      Object.values(this.$props.node.linesTo).forEach(line => {
        line = _data.lines[line.lineId];

        if (!line)
          return;

        line.x = ~~line.x;
        line.y = ~~line.y;
        line.genHitboxes();
      });

      Object.values(this.$props.node.linesFrom).forEach(line => {
        line = _data.lines[line.lineId];

        if (!line)
          return;

        line.ex = ~~line.ex;
        line.ey = ~~line.ey;
        line.genHitboxes();
      });

      let offY = this.lv.oy - ev.y,
        offX = this.lv.ox - ev.x;

      if (this.select && (offY < 10 && offY > -10) && (offX < 10 && offX > -10)) {
        _gc.selected.el && _gc.selected.el.classList.remove('selected');
        this.$el.classList.add('selected');
        _gc.selected.el = this.$el;
        _gc.selected.node = node;
      }
    }
  },
  beforeMount() {
    this.node.z = this.node.z - this.$props.cz;
    
  },
  mounted() {
    this.$props.hooks.updatePos = this.updatePos;
    this.updatePos();
    this.updateSize();
    this.$el.classList.add('transition-z');

    setTimeout(()=>{
      this.node.z = Math.floor(Math.random()*20);
      this.node.x = this.node.x;
      this.node.y = this.node.y;
      this.updatePos();
      this.$el.addEventListener('transitionend', ()=>{
        this.$el.classList.remove('transition-z');
      }, { once: true });
    },10);
    
  }
}
