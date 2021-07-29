import { _gc } from '/gc.js';

// components
import Viewport from '/src/components/Viewport/Viewport.js';

Vue.createApp({
  name: 'App',
  components: {
    Viewport
  }
}).mount('#app');
