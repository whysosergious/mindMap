import { _gc, _proxies } from '/gc.js';
// const { watchEffect } = Vue;

// scoped styles
// const scopedCSS = (id, vals) => `
//   [${ id }] h3 { 
//     font-size: ${ vals.fontSize }rem;
//   }
//   [${ id }].step-node { 
//     background-color: ${ vals.bg };
//   }`;


/** Node component */
export default {
  props: {
    node: Object,
    bg: String,
    cz: Number
  },
  setup(props) {
    // temp obj simulating fetched values

    
    // scoped css values
    // const cssVals = {
    //   fontSize: .8,
    //   bg: props.bg
    // }

    let count = ++_gc.count;
    return {
      // meta
      id: `gc${ count }`,
      count,
      props,

      // data
      mod: () => 1 - ((props.node.z + props.cz) / (_gc.viewport.perspective / 100) / 100), // adjustment modifier for 3d perspective

      // css
      // scopedCSS, cssVals
    }
  },
  template: await _gc.getTemplate('StepNode', true),
  methods: {
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
      
      window.addEventListener('mousemove', this.handleMove);
      window.addEventListener('mouseup', this.handleRelease, { once: true });
      viewport.addEventListener('scroll', this.handleScroll, { passive: false });
    },
    handleMove(ev)  {
      ev.preventDefault();
      let { $props: { node }, mod, lv } = this;
      mod = mod();

      node.y -= (lv.oy - ev.y)*mod - lv.y;
      node.x -= (lv.ox - ev.x)*mod - lv.x;
      lv.y = (lv.oy - ev.y)*mod;
      lv.x = (lv.ox - ev.x)*mod;

      // console.log('o ', node.x, node.y);
      this.updatePos();
    },
    handleScroll(ev) {
      const { $props: { node }, lv } = this;
      const { scrollTop, scrollLeft } = ev.target;

      node.y -= lv.osoy - scrollTop - lv.soy;
      node.x -= lv.osox - scrollLeft - lv.sox;
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
    this.node.z = this.node.z - this.$props.cz;
    
  },
  mounted() {
    this.updatePos();
    this.$el.classList.add('transition-z');

    setTimeout(()=>{
      this.node.z = Math.floor(Math.random()*40);
      this.node.x = this.node.x;
      this.node.y = this.node.y;
      this.updatePos();
      this.$el.addEventListener('transitionend', ()=>{
        this.$el.classList.remove('transition-z');
      }, { once: true });
    },10);
    
  }
}
