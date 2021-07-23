import canvasui from '/src/components/UI/UI.js';
import toolbar from '/src/components/Toolbar/Toolbar.js';
import StepNode from '/src/components/StepNode/StepNode.js';

const app = Vue.createApp({
  name: 'App',
  props: {
    // ref: Element
  },
  data() {    
    return {
      title: 'Hello world',
      // TODO get this value from _gc
      perspective: 400,
      canvasZ: 0
    }
  },
  components: {
    canvasui,
    toolbar,
    StepNode
  },
  mounted() {
    let viewport = document.querySelector('#viewport'),
      canvas = viewport.querySelector('#canvas');

    viewport.style.setProperty('--perspective', `${ this.perspective }px`);
    viewport.scrollTop = (viewport.scrollHeight - window.innerHeight)/2;
    viewport.scrollLeft = (viewport.scrollWidth - window.innerWidth)/2;

    // custom input actions
    viewport.addEventListener('contextmenu', ev => ev.preventDefault());
    // add more stuff here
    const listenForKeyEvent = () => window.addEventListener('keydown', ev => {
      if (ev.ctrlKey) {
        viewport.addEventListener('wheel', handleWheel, { passive: false });
      }
      window.addEventListener('keyup', ev => {
        viewport.removeEventListener('wheel', handleWheel, { passive: false });
        listenForKeyEvent();
      }, { once: true });
    }, { once: true });
    const handleWheel = ev => {
      ev.ctrlKey && ev.preventDefault();

      this.canvasZ -= ev.deltaY/5;
      
      canvas.style.transform = `translateZ(${ this.canvasZ }px)`;
    }
    listenForKeyEvent();
  }
}).mount('#app');