import { _gc, _proxies } from '/gc.js';


// scoped styles
const scopedCSS = (id, vals) => `
  [${ id }] h1 { 
    font-size: ${ vals.fontSize }rem; 
  }`;


/** Tool component */
export default {
  props: {

  },
  setup(props) {
    let count = ++_gc.count;
        
    // scoped css values
    const cssVals = {
      fontSize: 1
    }

    return {
      // meta
      id: `gc${ count }`,
      count,

      // content
      incText: 'Inc+',
      decText: 'Dec-',

      // css
      scopedCSS, cssVals,
      updateCss() {
        const { id, scopedCSS, cssVals } = this;
        _proxies.scopedCSS.val = { id, css: scopedCSS(id, cssVals) };
      }
    }
  },
  template: await _gc.getTemplate('Toolbar'),
  beforeMount() {
    this.updateCss();
  },
  mounted() {
    // console.log(this.$el);
  }
}