import { _gc, _data } from '/gc.js';

/** Context menu component */
export default {
  props: {
  },
  data() {
    return {
      mmData: _data,
      parsedMMData: '',
      ui: _gc.interface.ui,
      activeTab: 'mindmap'
    }
  },
  template: await _gc.getTemplate('DevMenu', true),
  computed: {
  },
  methods: {
    parseMMData() {
      if (this.activeTab === 'mindmap')
        this.parsedMMData = JSON.stringifyMap(this.mmData);
      else if (this.activeTab === 'actionmap')
        this.parsedMMData = _gc.sharedMethods.parseActionData(this.mmData);
        
      return this.parsedMMData;
    },
    displayData(tab) {
      this.activeTab = tab;
    }
  },
  beforeMount() {
    this.parseMMData();
  },
  mounted() {
    _gc.dev.parseMMData = this.parseMMData;
  }
}
