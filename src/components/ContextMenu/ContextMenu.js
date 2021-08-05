import { _gc } from '/gc.js';

/** Context menu component */
export default {
  props: {
    x: Number,
    y: Number,
    show: Boolean,
    deleteNode: Function,
  },
  data() {
    return {
      altClass: null,
      selected: _gc.selected,
      t: 'aaa'
    }
  },
  template: await _gc.getTemplate('ContextMenu', true),
  computed: {
    mousePos() {
      this.altClass = this.$props.show ? 'show' : null;
      return this.$props.y + this.$props.x === 0 ? null : `top: ${ this.$props.y }px; left: ${ this.$props.x }px;`;
    }
  },
  
  methods: {
    handleDeleteNode() {
      this.$props.deleteNode(this.selected.node);
    }
  },
  beforeMount() {
  },
  mounted() {
  }
}
