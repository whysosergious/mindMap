import { _gc, _proxies } from '/gc.js';
// const { watchEffect } = Vue;

// scoped styles
const scopedCSS = (id, vals) => `
  [${ id }] h3 { 
    font-size: ${ vals.fontSize }rem;
    color: ${ vals.bg === 'blue' ? 'white' : 'black' };
  }
  [${ id }].step-node { 
    background-color: ${ vals.bg };
  }`;


/** Node component */
export default {
  props: {
    z: Number,
    mod: String,
    bg: String,
    cz: Number
  },
  setup(props) {
    // temp obj simulating fetched values
    const data = {
      pos: {
        y: 930,
        x: 1371,
        z: 70,
        unit: 'px'
      },
      dims: {
        h: 7,
        w: 7,
        unit: 'rem'
      }
    }

    
    // scoped css values
    const cssVals = {
      fontSize: .8,
      bg: props.bg
    }

    let count = ++_gc.count;
    return {
      // meta
      id: `gc${ count }`,
      count,
      props,

      // data
      text: 'Step Node',
      data,
      mod: () => 1 - ((props.z + props.cz) / (_gc.viewport.perspective / 100) / 100), // adjustment modifier for 3d perspective

      // css
      scopedCSS, cssVals
    }
  },
  template: await _gc.getTemplate('StepNode', true),
  methods: {
    updateCss() {
      const { id, scopedCSS, cssVals } = this;
      _proxies.scopedCSS.val = { id, css: scopedCSS(id, cssVals) };
    },
    updatePos() {
      const { $el, props, data: { pos } } = this;
      
      $el.style.transform = `translate3d(${ pos.x }${ pos.unit }, ${ pos.y }${ pos.unit }, ${ props.z }${ pos.unit })`;
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
      
      window.addEventListener('mousemove', this.handleMove);
      window.addEventListener('mouseup', this.handleRelease, { once: true });
      viewport.addEventListener('scroll', this.handleScroll, { passive: false });
    },
    handleMove(ev)  {
      ev.preventDefault();
      let { data, mod, lv } = this;
      mod = mod();

      data.pos.y -= (lv.oy - ev.y)*mod - lv.y;
      data.pos.x -= (lv.ox - ev.x)*mod - lv.x;
      lv.y = (lv.oy - ev.y)*mod;
      lv.x = (lv.ox - ev.x)*mod;

      this.updatePos();
    },
    handleScroll(ev) {
      const { data, lv } = this;
      const { scrollTop, scrollLeft } = ev.target;

      data.pos.y -= lv.osoy - scrollTop - lv.soy;
      data.pos.x -= lv.osox - scrollLeft - lv.sox;
      lv.soy = lv.osoy - scrollTop;
      lv.sox = lv.osox - scrollLeft;

      this.updatePos();
    },
  
    handleRelease(ev) {
      window.removeEventListener('mousemove', this.handleMove);
      viewport.removeEventListener('scroll', this.handleScroll, { passive: false });
    }
  },
  beforeMount() {
    this.updateCss();
  },
  mounted() {
    this.updatePos();
  }
}
