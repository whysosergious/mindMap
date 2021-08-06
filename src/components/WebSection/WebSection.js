import { _gc, _web } from '/gc.js';

// components
import WebEdit from '/src/components/WebEdit/WebEdit.js';

/** Context menu component */
export default {
  template: await _gc.getTemplate('WebSection', true),
  props: {
    node: Object,
    cz: Number
  },
  data() {
    return {
      selected: _gc.selected,
      mod: () => 1 - ((this.$props.node.z + this.$props.cz ) / (_gc.viewport.perspective / 100) / 100), // adjustment modifier for 3d perspective
    }
  },
  components: {
    WebEdit
  },
  computed: {
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

        let y = (lv.oy - ev.y)*mod,
          x = (lv.ox - ev.x)*mod,
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

      $el.style.height = `${ node.h }px`;
      // $el.style.transform = `translate3d(${ node.x }px, ${ node.y }px, ${ node.z }px)`;
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

      lv.y = (lv.oy - ev.y)*mod;
      lv.x = (lv.ox - ev.x)*mod;
      
      this.updatePos();
    },  
    handleRelease(ev) {
      window.removeEventListener('mousemove', this.handleMove);
      const { $props: { node } } = this;

      node.x = ~~node.x;
      node.y = ~~node.y;
      node.h = ~~node.h;
      node.w = ~~node.w;

      let offY = this.lv.oy - ev.y,
        offX = this.lv.ox - ev.x;

      if (this.select && (offY < 10 && offY > -10) && (offX < 10 && offX > -10)) {
        _gc.interface.ui.closeAllSoftWindows(null, true)
        _gc.selected.el && _gc.selected.el.classList.remove('selected');
        this.$el.classList.add('selected');
        _gc.selected.el = this.$el;
        _gc.selected.node = node;
        _gc.interface.ui.activeSoftMenu = 'editor-menu';
      }
    }
  },
  beforeMount() {
  },
  mounted() {
    _gc.selected = this.selected;
    this.updatePos();
    this.updateSize();
    this.$props.node.updatePos = this.updatePos;
  }
}
