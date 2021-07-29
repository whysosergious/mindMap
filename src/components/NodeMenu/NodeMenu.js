import { _gc, _nodes } from '/gc.js';

/** Context menu component */
export default {
  props: {
    x: Number,
    y: Number,
    show: Boolean
  },
  data() {
    return {
      altClass: null,
      nodes: _nodes
    }
  },
  template: await _gc.getTemplate('NodeMenu', true),
  computed: {
    mousePos() {
      this.altClass = this.$props.show ? 'show' : null;
      return this.$props.y + this.$props.x === 0 ? null : `top: ${ this.$props.y }px; left: ${ this.$props.x }px;`;
    }
  },
  methods: {
  },
  beforeMount() {
  },
  mounted() {
  }
}
