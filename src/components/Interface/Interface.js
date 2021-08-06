import { _gc, _data, _proxies } from '/gc.js';

// components
import DevMenu from '/src/components/DevMenu/DevMenu.js';
import EditorMenu from '/src/components/EditorMenu/EditorMenu.js';

/** main UI component */
export default {
  props: {
    newMap: Function
  },
  data() {
    return {

      // data
      ui: _gc.interface.ui,
      nodeMenu: _gc.interface.nodeMenu
    }
  },
  template: await _gc.getTemplate('Interface', true),
  components: {
    DevMenu,
    EditorMenu
  },
  computed: {
    currentMenu() {
      return this.ui.activeSoftMenu || this.ui.activeMenu;
    }
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
    openMenu(menu) {
      _gc.interface.ui.closeAllSoftWindows(null, true);
      // if (this.ui.activeSoftMenu && this.ui.activeMenu)
      this.ui.activeMenu = this.ui.activeMenu !== menu ? menu : null;
    },
    // openSoftMenu(menu) {
    //   console.log('2')
    //   this.ui.activeSoftMenu = menu;
    //   this.lastOpenedMenu = this.ui.activeSoftMenu;
    // }
  },
  beforeMount() {
  },
  mounted() {
    _gc.interface.ui = this.ui;
  }
}
