import { _gc, _proxies } from '/gc.js';


// scoped styles
const scopedCSS = (id, vals) => `
  `;


/** main UI component */
export default {
  props: {

  },
  setup(props) {


    // scoped css values
    const cssVals = {
    }

    let count = ++_gc.count;
    return {
      // meta
      id: `gc${ count }`,
      count,
      props,

      // data
      text: 'UI',

      // css
      scopedCSS, cssVals
    }
  },
  template: await _gc.getTemplate('UI'),
  methods: {
    // updateCss() {
    //   const { id, scopedCSS, cssVals } = this;
    //   _proxies.scopedCSS.val = { id, css: scopedCSS(id, cssVals) };
    // },
  
  },
  beforeMount() {
    // this.updateCss();
  },
  mounted() {
    // console.log(this.$el);
  }
}
