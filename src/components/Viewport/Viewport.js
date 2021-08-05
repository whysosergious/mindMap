import { _gc, _data } from '/gc.js';

// components
import ContextMenu from '/src/components/ContextMenu/ContextMenu.js';
import NodeMenu from '/src/components/NodeMenu/NodeMenu.js';
import Interface from '/src/components/Interface/Interface.js';
import NodeLines from '/src/components/NodeLines/NodeLines.js';
import StepNode from '/src/components/StepNode/StepNode.js';

/** Canvas component */
export default {
  props: {

  },
  data() {
    return {
      count: 1,
      perspective: _gc.viewport.perspective,
      offset: {
        scrY: 0,
        scrX: 0,
        canZ: 0
      },
      contextMenu: _gc.interface.contextMenu,
      nodeMenu: _gc.interface.nodeMenu,
      nodes: _data.nodes,
      nodeHooks: {
        updatePos: {}
      },
      selected: _gc.selected
    }
  },
  template: await _gc.getTemplate('Viewport'),
  components: {
    ContextMenu,
    NodeMenu,
    Interface,
    NodeLines,
    StepNode
  },
  methods: {
    addNode(node) {
      this.nodes[node.id] = node;
    },
    deleteNode(node) {
      Object.values(node.linesFrom).forEach(({ lineId, nodeId }) => {
        _data.nodes[nodeId] && delete _data.nodes[nodeId].linesTo[lineId];
        _data.lines[lineId] && delete _data.lines[lineId];
      });
      Object.values(node.linesTo).forEach(({ lineId, nodeId }) => {
        _data.nodes[nodeId] && delete _data.nodes[nodeId].linesFrom[lineId];
        _data.lines[lineId] && delete _data.lines[lineId];
      });
      delete _data.nodes[node.id];
      
      Object.keys(_data.nodes).length === 0 && _gc.dev.parseMMData()

      this.closeOpenWindows(null, true);
    },
    closeOpenWindows(ev, force=false) {
      if (!force && ev.target.id !== 'linecanvas' && ev.target.tag !== 'circle')
        return;

      this.contextMenu.show = false;

      if (!this.nodeMenu.keep) {
        this.nodeMenu.show = false;
        this.nodeMenu.x = 0;
        this.nodeMenu.y = 0;
      }

      _gc.selected.el && _gc.selected.el.classList.remove('selected');
      _gc.selected.el = null;
      _gc.selected.node = null;
    },
    startDraw(type) {
      console.log(type)
    }
  },
  beforeMount() {
  },
  mounted() {
    _gc.interface.nodeMenu = this.nodeMenu;
    _gc.interface.contextMenu = this.contextMenu;
    _gc.interface.ui.closeAllSoftWindows = this.closeOpenWindows;
    let vph = viewport.offsetHeight,
      vpw = viewport.offsetWidth;

    console.log(vph, vpw, { viewport })
    window.addEventListener('resize', ev => {
      vph = viewport.offsetHeight;
      vpw = viewport.offsetWidth;
    }, { passive: true });

    viewport.style.setProperty('--perspective', `${ this.perspective }px`);
    // viewport.scrollTop = (viewport.scrollHeight - window.innerHeight)/2;
    // viewport.scrollLeft = (viewport.scrollWidth - window.innerWidth)/2;
    let vpsh = viewport.scrollHeight;
    let vpsw = viewport.scrollWidth;
    let scrollableY = (vpsh - vph) / 2;
    let scrollableX = (vpsw - vpw) / 2;

    // custom input actions
    viewport.addEventListener('contextmenu', ev => {
      ev.preventDefault();
      this.closeOpenWindows(ev, true);

      let nodeId = ev.target.dataset.nodeid,
      menu, placeableX, placeableY;

      if (ev.target.dataset.nodeid) {
        menu = this.contextMenu;
        placeableX = vpw - contextmenu.offsetWidth;
        placeableY = vph - contextmenu.offsetHeight;
        _gc.selected.node = _data.nodes[nodeId];
      } else {
        menu = this.nodeMenu;
        placeableX = vpw - nodemenu.offsetWidth;
        placeableY = vph - nodemenu.offsetHeight;
        menu.keep = false;
      }

      menu.x = ev.x > placeableX ? placeableX : ev.x;
      menu.y = ev.y > placeableY ? placeableY : ev.y;
      menu.show = true;
    });

    const { offset } = this;
    let mod;
    const handleNavigation = ev => {
      this.closeOpenWindows(ev, true);

      let soy = (ev.y - vph/2) / (offset.canZ > 10 ? 1+offset.canZ/10 : 5),
          sox = (ev.x - vpw/2) / (offset.canZ > 10 ? 1+offset.canZ/10 : 5),
          delta = ev.deltaY;

      if (ev.ctrlKey) {
        ev.preventDefault();
        ev.stopPropagation();

        

        // viewport.scrollTo({
        //     top: viewport.scrollTop + (delta > 0 ? -soy : soy),
        //     left: viewport.scrollLeft + (delta > 0 ? -sox : sox),
        //     behavior: 'smooth'
        //   });
        if (offset.canZ >= 300 && delta < 0) {
          offset.canZ = 300;
          canvas.style.transform = `translate3d(${ offset.scrX }px, ${ offset.scrY }px, ${ offset.canZ }px)`;
          return;
        } else if (offset.canZ <= -500 && delta > 0) {
          offset.canZ = -500;
          canvas.style.transform = `translate3d(${ offset.scrX }px, ${ offset.scrY }px, ${ offset.canZ }px)`;
          return;
        } else {
          offset.scrY = offset.scrY + (delta > 0 ? soy : -soy);
          offset.scrX = offset.scrX + (delta > 0 ? sox : -sox);
  
          offset.canZ -= offset.canZ > 10 ? delta/2.5 / (1+offset.canZ/100) : delta/2.5;
        }

        
      } else if (ev.shiftKey) {
        offset.scrX -= offset.canZ > 10 ? delta / (1+offset.canZ/100) : delta;
      } else {
        offset.scrY -= offset.canZ > 10 ? delta / (1+offset.canZ/100) : delta;
      }

      if (offset.canZ > 300 && delta < 0) {
      
      } else {
        canvas.style.transform = `translate3d(${ offset.scrX }px, ${ offset.scrY }px, ${ offset.canZ }px)`;
      }
      
      // // ev.stopImmediatePropagation();
      // // console.log('ffff');
      // let delta = ev.deltaY;
      // // if (!delta)
      // //   return;

      // let mod = 1 + (offset.canZ/4/100);
      // mod = mod < 0 ? 0 : mod;
      // // console.log('aaaa');
      

      // if (ev.ctrlKey && offset.canZ > -400) {
      //   offset.canZ = offset.canZ - delta/2.5;

      //   let soy = (ev.y - vph/2) / 5,
      //     sox = (ev.x - vpw/2) / 5;

      //   // soy = delta > 0 ? soy : -soy;
      //   // sox = delta > 0 ? sox : -sox;
      //   offset.scrY = offset.scrY + (delta > 0 ? -soy : soy);
      //   offset.scrX = offset.scrX + (delta > 0 ? -sox : sox);
      //   // canvas.style.transform = `translate3d(${ compY }px, ${ compX }px, ${ offset.canZ }px)`;
      //   // console.log('z');
      // } else if (ev.ctrlKey && offset.canZ <= -400 && delta <= 0) {
      //   offset.canZ = -399;
      // } else {
      //   if (!ev.shiftKey && offset.scrY >= -scrollableY && delta <= 0) {
      //     offset.scrY = offset.scrY + delta/2;
      //   } else if (!ev.shiftKey && offset.scrY <= scrollableY && delta >= 0) {
      //     offset.scrY = offset.scrY + delta/2;
      //   }
      //   if (ev.shiftKey && offset.scrX >= -scrollableX && delta <= 0) {
      //     offset.scrX = offset.scrX + delta/2;
      //   } else if (ev.shiftKey && offset.scrX <= scrollableX && delta >= 0) {
      //     offset.scrX = offset.scrX + delta/2;
      //   }
      // }
      
      // console.log(mod);

      
      
      
      // canvas.style.transform = `translate3d(${ -(offset.scrX*mod) }px, ${ -(offset.scrY*mod) }px, ${ offset.canZ }px)`;
      // // mod = (1 - ((-offset.canZ) / (400 / 100) / 100));
      
      
    }

    viewport.addEventListener('scroll', handleNavigation, { passive: false, capture: false });
    canvas.addEventListener('wheel', handleNavigation, { passive: false, capture: false });
    // viewport.addEventListener('touchmove', handleNavigation, { passive: false, capture: false });
    
  }
}
