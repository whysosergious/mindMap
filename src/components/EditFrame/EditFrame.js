import { _gc } from '/gc.js'

/** Edit frame component */
export default {
  props: {
    cz: Number,
    node: Object
  },
  emits: ['resize', 'conn-line'],
  data() {
    return {

    }
  },
  template: await _gc.getTemplate('EditFrame', true),
  methods: {
    handleResize(ev, origin) {
      this.$emit('resize', ev, origin);
    },
    handleStartConnect(ev, type) {
      // console.log('frame', this.$parents, this.$root.$.components.Viewport.components.NodeLines.methods.startDraw(ev))
      let conn = {
        type,
        node: this.$props.node
      }
      _gc.sharedMethods.startDraw(ev, conn)
    }
  },
  beforeMount() {
  },
  mounted() {
  }
}