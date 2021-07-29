import { _gc, _proxies } from '/gc.js';

/** main UI component */
export default {
  props: {

  },
  data() {
    let count = ++_gc.count;
    return {
      // meta
      id: `gc${ count }`,
      count,

      // data
      ui: _gc.interface.ui
    }
  },
  template: await _gc.getTemplate('Interface', true),
  computed: {
    
  },
  methods: {
    selectTool(tool) {
      this.ui.activeTool = tool;
    },
    openNodeMenu() {
      _gc.interface.nodeMenu.show = true;
      _gc.interface.nodeMenu.x = 0;
      _gc.interface.nodeMenu.y = 0;
    }
  },
  beforeMount() {
  },
  mounted() {
    _gc.interface.ui = this.ui;
  }
}
