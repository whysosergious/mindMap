import { _gc, _data, _proxies } from '/gc.js';

// components
import DevMenu from '/src/components/DevMenu/DevMenu.js';

/** main UI component */
export default {
  props: {

  },
  data() {
    let count = ++_data.count;
    return {
      // meta
      id: `gc${ count }`,
      count,

      // data
      ui: _gc.interface.ui,
      nodeMenu: _gc.interface.nodeMenu
    }
  },
  template: await _gc.getTemplate('Interface', true),
  components: {
    DevMenu
  },
  computed: {
    
  },
  methods: {
    selectTool(tool) {
      this.ui.activeTool = tool;
    },
    openNodeMenu() {
      this.ui.closeAllSoftWindows(null, true);
      if (_gc.interface.nodeMenu.keep) {
        _gc.interface.nodeMenu.show = false;
        _gc.interface.nodeMenu.keep = false;
        return;
      }
      _gc.interface.nodeMenu.show = true;
      _gc.interface.nodeMenu.keep = true;
      _gc.interface.nodeMenu.x = 0;
      _gc.interface.nodeMenu.y = 0;
    },
    openDetailsWindow(menu) {
      this.ui.activeMenu = this.ui.activeMenu !== menu ? menu : null;
    }
  },
  beforeMount() {
  },
  mounted() {
    // _gc.interface.ui = this.ui;
  }
}
