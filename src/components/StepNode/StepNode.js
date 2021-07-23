import { _gc, _proxies } from '/gc.js';
const { watchEffect } = Vue;


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
        y: 400 * 2,
        x: 600 * 2,
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
      mod: () => 1 - ((props.z + props.cz) / (_gc.viewport.perspective / 100) / 100), // modifier for adjustment for 3d perspective

      // css
      scopedCSS, cssVals
    }
  },
  template: await _gc.getTemplate('StepNode'),
  methods: {
    updateCss() {
      const { id, scopedCSS, cssVals } = this;
      _proxies.scopedCSS.val = { id, css: scopedCSS(id, cssVals) };
    },
    updatePos(applyMod=true, a=true) {
      const { $el, props, mod, data } = this;
      let m = applyMod ? mod() : 1;
      console.log(m, data.pos.x, {$el}, $el.getBoundingClientRect())
      
      a && ($el.style.transform = `translate3d(${ data.pos.x*m }${ data.pos.unit }, ${ data.pos.y*m }${ data.pos.unit }, ${ props.z }${ data.pos.unit })`);
    },
    w() {
      watchEffect(() => {
        console.log('g', this.props.cz)
        this.props.cz;
        this.updatePos(true, false);
      });
    },

    // event handlers
    handleGrab(ev) {
      this.grabOrigin = {
        y: this.data.pos.y - ev.y,
        x: this.data.pos.x - ev.x,
        scrollY: this.$root.$el.scrollTop,
        scrollX: this.$root.$el.scrollLeft
      }
      console.log(ev)
      window.addEventListener('mousemove', this.handleMove);
      this.$root.$el.addEventListener('scroll', this.handleScroll);
      window.addEventListener('mouseup', this.handleRelease, { once: true });
    },
    handleMove(ev)  {
      ev.preventDefault();
      this.data.pos.y = ev.y + this.grabOrigin.y;
      this.data.pos.x = ev.x + this.grabOrigin.x;

      this.updatePos();
    },
    handleScroll(ev)  {
      // TODO safeguard for scrolling during item drag, below is a bad solution
      // this.data.pos.y = this.$root.$el.scrollTop + this.grabOrigin.scrollY;
      // this.data.pos.x = this.$root.$el.scrollLeft + this.grabOrigin.scrollX;

      // this.updatePos(false);
    },
    handleRelease(ev) {
      window.removeEventListener('mousemove', this.handleMove);
      this.$root.$el.removeEventListener('scroll', this.handleScroll);
    }
  },
  beforeMount() {
    this.updateCss();
  },
  mounted() {
    this.updatePos();
    // console.log(this.w());
    // console.log(this.$el);
  },
  

}
