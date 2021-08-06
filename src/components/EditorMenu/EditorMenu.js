import { _gc, _data } from '/gc.js';

/** Context menu component */
export default {
  props: {
  },
  data() {
    return {
      selected: _gc.selected,
    }
  },
  template: await _gc.getTemplate('EditorMenu', true),
  computed: {
  },
  methods: {
    handleMakeInitial() {
      _data.initial = this.selected.node.id;
      _gc.sharedMethods.setInitialNode();
    }
  },
  beforeMount() {
  },
  mounted() {
    _gc.selected = this.selected;
  }
}
