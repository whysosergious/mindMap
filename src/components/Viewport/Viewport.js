import { _gc } from '/gc.js';

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
      perspective: _gc.viewport.perspective,
      offset: {
        scrY: 0,
        scrX: 0,
        canZ: 0
      },
      nodeMenu: _gc.interface.nodeMenu
    }
  },
  template: await _gc.getTemplate('Viewport'),
  components: {
    NodeMenu,
    Interface,
    NodeLines,
    StepNode
  },
  methods: {
    closeOpenWindows(ev) {
      if (ev.target.id !== 'linecanvas' && ev.target.tag !== 'circle')
        return;

      this.nodeMenu.show = false;
      this.nodeMenu.x = 0;
      this.nodeMenu.y = 0;
    }
  },
  beforeMount() {
  },
  mounted() {
    _gc.interface.nodeMenu = this.nodeMenu;
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

      let placeableX = vpw - nodemenu.offsetWidth,
        placeableY = vph - nodemenu.offsetHeight;

      this.nodeMenu.x = ev.x > placeableX ? placeableX : ev.x;
      this.nodeMenu.y = ev.y > placeableY ? placeableY : ev.y;
      this.nodeMenu.show = true;

      
    });

    const { offset } = this;
    let mod;
    const handleNavigation = ev => {
      let soy = (ev.y - vph/2) / 5,
          sox = (ev.x - vpw/2) / 5,
          delta = ev.deltaY;

      if (ev.ctrlKey) {
        ev.preventDefault();
        ev.stopPropagation();

        offset.scrY = offset.scrY + (delta > 0 ? soy : -soy);
        offset.scrX = offset.scrX + (delta > 0 ? sox : -sox);

        // viewport.scrollTo({
        //     top: viewport.scrollTop + (delta > 0 ? -soy : soy),
        //     left: viewport.scrollLeft + (delta > 0 ? -sox : sox),
        //     behavior: 'smooth'
        //   });

        
        offset.canZ -= delta/2.5;
      } else if (ev.shiftKey) {
        offset.scrX -= delta;
      } else {
        offset.scrY -= delta;
      }

      canvas.style.transform = `translate3d(${ offset.scrX }px, ${ offset.scrY }px, ${ offset.canZ }px)`;
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

    // viewport.addEventListener('scroll', handleNavigation, { passive: false, capture: false });
    viewport.addEventListener('wheel', handleNavigation, { passive: false, capture: false });
    // viewport.addEventListener('touchmove', handleNavigation, { passive: false, capture: false });
    
  }
}
