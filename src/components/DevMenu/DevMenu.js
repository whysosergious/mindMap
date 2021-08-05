import { _gc, _data } from '/gc.js';

/** Context menu component */
export default {
  props: {
  },
  data() {
    return {
      mmData: _data,
      parsedMMData: '',
      ui: _gc.interface.ui
    }
  },
  template: await _gc.getTemplate('DevMenu', true),
  computed: {
  },
  methods: {
    parseMMData() {
      this.parsedMMData = JSON.stringifyMap(this.mmData);
      return this.parsedMMData;
    }
  },
  beforeMount() {
    this.parseMMData();
  },
  mounted() {
    _gc.dev.parseMMData = this.parseMMData;
  }
}
