import { _gc } from '/gc.js';

/** Node line canvas component */
export default {
  props: {
  },
  data() {
    return {
      count: 0,
      lines: {}
    }
  },
  template: await _gc.getTemplate('NodeLines', true),
  methods: {
    startDraw(ev) {
      if (_gc.interface.ui.activeTool !== 'line')
        return;
      
      let id = `ugl${ this.count++ }`;
      this.lines[id] = {
        id,
        altClass: null,
        x: ev.offsetX,
        y: ev.offsetY,
        ex: ev.offsetX,
        ey: ev.offsetY,
        count: 0,
        points: [],
        hitboxes: [],
        genHitboxes() {
          if (this.points.length === 0) {
            this.hitboxes = [{
              pointIndex: 0,
              x: this.x,
              y: this.y,
              ex: this.ex,
              ey: this.ey,
            }];
          } else {
            this.hitboxes = [];
            let count = this.points.length;
            for (let i = 0; i <= count; i++) {
              let hitbox = {
                pointIndex: i,
                x: i === 0 ? this.x : this.points[i-1].x,
                y: i === 0 ? this.y : this.points[i-1].y,
                ex: i === count ? this.ex : this.points[i].x,
                ey: i === count ? this.ey : this.points[i].y
              }
  
              this.hitboxes.push(hitbox);
            }
          }

          setTimeout(()=>this.lineTools(),10);
        },
        vertex() {
          let result = '';
          this.points.forEach(point => {
            result += `L ${ point.x } ${ point.y }`;
          });
          return result;
        },
        deleteBtn: {
          x: ev.offsetX,
          y: ev.offsetY
        },
        optionsBtn: {
          x: ev.offsetX,
          y: ev.offsetY
        },
        lineTools() {
          if (!this.el)
            this.el = document.getElementById(this.id)

          this.deleteBtn = this.el.getPointAtLength(30);
          this.optionsBtn = this.el.getPointAtLength(70);
        }
      }

      this.setupListeners(this.drawTo, this.lines[id]);
    },
    setupListeners(eventFunc, line, point) {
      let initFunc = (ev)=>eventFunc(ev, line, point),
        endFunc = (ev)=>this.handleMouseUp(ev, line, initFunc);

      line.altClass = 'active';
      app.classList.add('drawing');
      linecanvas.addEventListener('mousemove', initFunc);
      window.addEventListener('mouseup', endFunc, { once: true });
    },
    handleMouseUp(ev, line, eventFunc) {
      app.classList.remove('drawing');
      line.altClass = null;
      line.genHitboxes();
      linecanvas.removeEventListener('mousemove', eventFunc);

      let target = document.elementFromPoint(ev.x, ev.y);
      // console.log(target, ev.offsetX, ev.offsetY);
    },
    deleteLine(id) {
      delete this.lines[id];
      console.log(this.lines, id)
    },
    // these need to be joined *********
    drawFrom(ev, line) {
      line.lineTools();
      line.x = ev.offsetX;
      line.y = ev.offsetY;
    },
    drawTo(ev, line) {
      line.lineTools();
      line.ex = ev.offsetX;
      line.ey = ev.offsetY;
    },
    // ^^ *******************************
    newPoint(ev, line, index) {
      let point = {
        id: `${ line.id }p${ line.count++ }`,
        x: ev.offsetX,
        y: ev.offsetY
      }

      line.points.splice(index, 0, point);
      this.setupListeners(this.movePoint, line, line.points[index]);
    },
    deletePoint(line, index) {
      line.points.splice(index, 1);
      line.genHitboxes();
    },
    initMovePoint(line, point) {
      this.setupListeners(this.movePoint, line, point);
    },
    movePoint(ev, line, point) {
      line.lineTools();
      point.x = ev.offsetX;
      point.y = ev.offsetY;
    },
    moveStartPoint(line) {
      this.setupListeners(this.drawFrom, line);
    },
    moveEndPoint(line) {
      this.setupListeners(this.drawTo, line);
    }
  },
  beforeMount() {
  },
  mounted() {
  }
}
