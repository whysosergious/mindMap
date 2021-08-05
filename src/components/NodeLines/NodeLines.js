import { _gc, _data } from '/gc.js';

/** Node line canvas component */
export default {
  props: {
  },
  data() {
    return {
      lines: _data.lines
    }
  },
  template: await _gc.getTemplate('NodeLines', true),
  methods: {
    startDraw(ev, conn = {}) {
      if (_gc.interface.ui.activeTool !== 'line' && !conn.type)
        return;

      // conn || (conn.type = null);
      
      let id = `ugl${ ++_data.count }`;
      this.lines[id] = {
        id,
        altClass: null,
        x: conn.type === 'connto' ? conn.node.x + conn.node.w/2 : conn.type === 'connfrom' ? conn.node.x - 15 : ev.offsetX,
        y: conn.type === 'connto' ? conn.node.y + conn.node.h/2 : conn.type === 'connfrom' ? conn.node.y + conn.node.h/2 : ev.offsetY,
        ex: conn.type === 'connfrom' ? conn.node.x + conn.node.w/2 : conn.type === 'connto' ? conn.node.x + conn.node.w + 5 : ev.offsetX,
        ey: conn.type === 'connfrom' ? conn.node.y + conn.node.h/2 : conn.type === 'connto' ? conn.node.y + conn.node.h/2 : ev.offsetY,
        rel: {x:0,y:0,ex:0,ey:0,ed:0},
        points: [],
        hitboxes: [],
        deleteBtn: {
          x: ev.offsetX,
          y: ev.offsetY
        },
        optionsBtn: {
          x: ev.offsetX,
          y: ev.offsetY
        },
        vertex() {
          let result = '';
          this.points.forEach(point => {
            result += `L ${ point.x } ${ point.y }`;
          });
          return result;
        },
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
        lineTools() {
          if (!this.el)
            this.el = document.getElementById(this.id)

          let delBtnPoint = this.el.getPointAtLength(30)
          this.deleteBtn = {
            x: ~~delBtnPoint.x,
            y: ~~delBtnPoint.y
          };
          let optBtnPoint = this.el.getPointAtLength(70)
          this.optionsBtn = {
            x: ~~optBtnPoint.x,
            y: ~~optBtnPoint.y
          };
        }
      }

      this.lines[id].genHitboxes();

      if (conn.type === 'connto') {
        this.lines[id].connFrom = conn.node.id;
        conn.node.linesTo[id] = {
          lineId: id,
          nodeId: null
        }
        this.setupListeners(this.drawTo, this.lines[id]);
      } else if (conn.type === 'connfrom') {
        this.lines[id].connTo = conn.node.id;
        conn.node.linesFrom[id] = {
          lineId: id,
          nodeId: null
        }
        this.setupListeners(this.drawFrom, this.lines[id]);
      } else {
        this.setupListeners(this.drawTo, this.lines[id]);
      }
    },
    setupListeners(eventFunc, line, point) {
      let initFunc = (ev)=>eventFunc(ev, line, point),
        endFunc = (ev)=>this.handleMouseUp(ev, line, initFunc, eventFunc.name);

      line.altClass = 'active';
      app.classList.add('drawing');
      linecanvas.addEventListener('mousemove', initFunc);
      window.addEventListener('mouseup', endFunc, { once: true });
    },
    handleMouseUp(ev, line, eventFunc, action) {
      app.classList.remove('drawing');
      line.altClass = null;
      line.genHitboxes();
      linecanvas.removeEventListener('mousemove', eventFunc);

      let target = document.elementFromPoint(ev.x, ev.y);
      if (/drawTo/.test(action) && target.dataset.nodeid) {
        line.connTo = target.dataset.nodeid;

        if (line.connFrom) 
          _data.nodes[line.connFrom].linesTo[line.id].nodeId = line.connTo;
        
        _data.nodes[line.connTo].linesFrom[line.id] = {
          lineId: line.id,
          nodeId: line.connFrom
        }

        line.ex = _data.nodes[line.connTo].x + _data.nodes[line.connTo].w/2;
        line.ey = _data.nodes[line.connTo].y + _data.nodes[line.connTo].h/2;
      } else if (/drawFrom/.test(action) && target.dataset.nodeid) {
        line.connFrom = target.dataset.nodeid;

        if (line.connTo) 
          _data.nodes[line.connTo].linesFrom[line.id].nodeId = line.connFrom;

        _data.nodes[line.connFrom].linesTo[line.id] = {
          lineId: line.id,
          nodeId: line.connTo
        }

        line.x = _data.nodes[line.connFrom].x + _data.nodes[line.connFrom].w/2;
        line.y = _data.nodes[line.connFrom].y + _data.nodes[line.connFrom].h/2;
      }
      line.connFrom && _gc.sharedMethods.calcRelPoint(line); 
      line.connTo && _gc.sharedMethods.calcRelEndPoint(line);
    },
    deleteLine(id) {
      delete this.lines[id];
      console.log(this.lines, id)
    },
    // these need to be joined *********
    drawFrom(ev, line) {
      line.lineTools();

      if (line.connFrom) {
        delete _data.nodes[line.connFrom].linesTo[line.id];
        line.connFrom = null;
      }

      line.rel.x = 0;
      line.rel.y = 0;
      line.x = ev.offsetX;
      line.y = ev.offsetY;

      line.connTo && _gc.sharedMethods.calcRelEndPoint(line);
    },
    drawTo(ev, line) {
      line.lineTools();

      if (line.connTo) {
        delete _data.nodes[line.connTo].linesFrom[line.id];
        line.connTo = null;
      }

      line.rel.ex = 0;
      line.rel.ey = 0;
      line.ex = ev.offsetX;
      line.ey = ev.offsetY;

      line.connFrom && _gc.sharedMethods.calcRelPoint(line);
      _gc.sharedMethods.calcRelRotation(line);
    },
    // ^^ *******************************
    newPoint(ev, line, index) {
      let point = {
        id: `${ line.id }p${ ++_data.count }`,
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

      line.connFrom && _gc.sharedMethods.calcRelPoint(line); 
      line.connTo && _gc.sharedMethods.calcRelEndPoint(line); 
    },
    moveStartPoint(line) {
      this.setupListeners(this.drawFrom, line);
    },
    moveEndPoint(line) {
      this.setupListeners(this.drawTo, line);
    }
  },
  beforeMount() {
    Object.values(_data.lines).forEach(line => {
      line.genHitboxes = function() {
        if (line.points.length === 0) {
          line.hitboxes = [{
            pointIndex: 0,
            x: line.x,
            y: line.y,
            ex: line.ex,
            ey: line.ey,
          }];
        } else {
          line.hitboxes = [];
          let count = line.points.length;
          for (let i = 0; i <= count; i++) {
            let hitbox = {
              pointIndex: i,
              x: i === 0 ? line.x : line.points[i-1].x,
              y: i === 0 ? line.y : line.points[i-1].y,
              ex: i === count ? line.ex : line.points[i].x,
              ey: i === count ? line.ey : line.points[i].y
            }

            line.hitboxes.push(hitbox);
          }
        }

        setTimeout(()=>line.lineTools(),10);
      },
      line.vertex = function() {
        let result = '';
        line.points.forEach(point => {
          result += `L ${ point.x } ${ point.y }`;
        });
        return result;
      }

      line.lineTools = function() {
        if (!line.el || Object.values(line.el).length === 0)
          line.el = document.getElementById(line.id)

        let delBtnPoint = line.el.getPointAtLength(30)
        line.deleteBtn = {
          x: ~~delBtnPoint.x,
          y: ~~delBtnPoint.y
        };
        let optBtnPoint = line.el.getPointAtLength(70)
        line.optionsBtn = {
          x: ~~optBtnPoint.x,
          y: ~~optBtnPoint.y
        };
      }

      line.genHitboxes();
    });
  },
  mounted() {
    _gc.sharedMethods.startDraw = this.startDraw;
    _data.lines = this.lines;
  }
}
