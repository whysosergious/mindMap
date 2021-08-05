import { _gc, _data } from '/gc.js';

/** Context menu component */
export default {
  props: {
  },
  data() {
    return {
      mmData: _data,
    }
  },
  template: await _gc.getTemplate('DevMenu', true),
  methods: {
  },
  beforeMount() {
  },
  mounted() {
  }
}
