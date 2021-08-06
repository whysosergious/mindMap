import { _gc, _web } from '/gc.js';

/** Context menu component */
export default {
  template: await _gc.getTemplate('WebEdit', true),
  props: {
    node: Object,
    cz: Number
  },
  setup() {
    return {
      col: 1,
      row: 1
    }
  },
  data() {
    return {
      selected: _gc.selected,
      mod: () => 1 - (((this.$props.node.z || 0) + this.$props.cz ) / (_gc.viewport.perspective / 100) / 100), // adjustment modifier for 3d perspective
    }
  },

  computed: {
  },
  methods: {
    numberSlots() {
      if (this.col * this.row > this.$props.node.gc * this.$props.node.gr) {
        this.col = 1;
        this.row = 1;
      }
      if (this.col > this.$props.node.gc) {
        this.col = 1;
        this.row++;
      }
      return `${ this.row }-${ this.col++ }`;
    },
    handleStartResize(ev, origin) {

      // latest & original values: { coords, scroll offsets }
      this.lv = {
        y: 0,
        x: 0,
        oy: ev.y,
        ox: ev.x,
        noy: this.$props.node.y,
        nox: this.$props.node.x,
        noh: this.$props.node.h,
        now: this.$props.node.w
      }


      const handleResize = ev => {
        let { $props: { node }, mod, lv } = this;
        mod = mod();

        let y = (lv.oy - ev.y)*mod,
          x = (lv.ox - ev.x)*mod,
          update = false;

          node.h = lv.noh - y;
          update = true;
          
        // if (node.w <= 400 && node.w > 50) {
        //   update = true;
        // }
  

        // if (/br|bl/.test(origin) && lv.noh - y <= 400 && lv.noh - y >= 50) {
        //   node.h = lv.noh - y;
        // }
        // if (/tr|tl/.test(origin)&& lv.noh + y <= 400 && lv.noh + y >= 50) {
        //   node.y = lv.noy - y;
        //   node.h = lv.noh + y;
        // }

        // if (/tl|bl/.test(origin) && lv.now + x <= 400 && lv.now + x >= 50) {
        //   node.x = lv.nox - x;
        //   node.w = lv.now + x;
        // }
        // if (/tr|br/.test(origin) && lv.now - x <= 400 && lv.now - x >= 50) {
        //   node.w = lv.now - x;
        // }
          
        if (update) {
          // this.updateSize();
          this.$props.node.updatePos();
        }
      }
      
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', (ev)=>{
        // this.handleRelease(ev);
        window.removeEventListener('mousemove', handleResize);
      }, { once: true });
    },
  },
  beforeMount() {
    _web.gn = {
      c: 1,
      r: 1
    }
  },
  mounted() {
    _gc.selected = this.selected;
  }
}
