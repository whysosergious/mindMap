// global controller
export const _gc = {
  count: 0,
  templates: {},
  viewport: {
    perspective: 400,
    winHeight: window.innerHeight,
    winWidth: window.innerWidth
  },
  /** Fetching html templates as string */
  getTemplate: async function(name, hasCss=false) {
    const ext = '.cshtml';

    if (hasCss) {
      this.templateCSSImports.push(`@import "src/components/${ name }/${ name }.css";`);
      componentsheet.innerHTML = this.templateCSSImports.join('\n');
    }

    return fetch(`src/components/${ name }/${ name }${ ext }`)
      .then(response => response.text())
      .then(data => this.templates[name] = data)
      .catch(data => console.debug(`Fetch failed: ${ data.reason }`));
  },
  templateCSSImports: [],
  interface: {
    ui: {
      activeTool: 'cursor'
    },
    nodeMenu: {
      x: 0,
      y: 0,
      show: false
    }
  }
}


// proxies & handlers
const scopedCSSHandler = {
  sheet: (() => {
    let sheet = document.createElement('style');
    sheet.id = 'scopedsheet';
    document.head.appendChild(sheet);
    return sheet;
  })(),
  components: {},
  get: function(obj, prop) {
    return obj[prop];
  },
  set: function(obj, prop, value) {
    const { id, css, mute=false, defer=false } = value;

    const saveAndRender = () => {
      this.components[id] = css.replace(/\s+[^\S]/g, '');
      this.sheet.textContent = Object.values(this.components).join('\n');
    }

    if (defer)
      return true;

    obj[prop] = value;

    if (mute)
      return true;

    saveAndRender();
    
    return true;
  }
}

const scopedCSS = new Proxy({ val: null }, scopedCSSHandler);
export const _proxies = {
  scopedCSS
}



// preset nodes
export const _presetNodes = [
  {
    label: 'Email',
    icon: 'src/assets/vector/files/nodes/email.svg',
  },
  {
    label: 'Send',
    icon: 'src/assets/vector/files/nodes/send.svg',
  },
  {
    label: 'Opened mail',
    icon: 'src/assets/vector/files/nodes/email-open.svg',
  },
  {
    label: 'Time mod',
    icon: 'src/assets/vector/files/nodes/time-mod.svg',
  },
  {
    label: 'Condition',
    icon: 'src/assets/vector/files/nodes/if-mod.svg',
  },
  {
    label: 'Sms',
    icon: 'src/assets/vector/files/nodes/sms.svg',
  },
  {
    label: 'Event',
    icon: 'src/assets/vector/files/nodes/event.svg',
  },
  {
    label: 'Survey',
    icon: 'src/assets/vector/files/nodes/survey.svg',
  },
  {
    label: 'Pause',
    icon: 'src/assets/vector/files/nodes/pause.svg',
  },
  {
    label: 'Resume',
    icon: 'src/assets/vector/files/nodes/resume.svg',
  },
  {
    label: 'Stop',
    icon: 'src/assets/vector/files/nodes/stop.svg',
  },
  {
    label: 'Segments',
    icon: 'src/assets/vector/files/nodes/segments.svg',
  },
  {
    label: 'Bounced mail',
    icon: 'src/assets/vector/files/nodes/email-bounce.svg',
  },
  {
    label: 'Email error',
    icon: 'src/assets/vector/files/nodes/email-error.svg',
  },
  {
    label: 'Send email',
    icon: 'src/assets/vector/files/nodes/email-send.svg',
  },


  // repeated
  {
    label: 'Condition',
    icon: 'src/assets/vector/files/nodes/if-mod.svg',
  },
  {
    label: 'Sms',
    icon: 'src/assets/vector/files/nodes/sms.svg',
  },
  {
    label: 'Event',
    icon: 'src/assets/vector/files/nodes/event.svg',
  },
  {
    label: 'Survey',
    icon: 'src/assets/vector/files/nodes/survey.svg',
  },
  {
    label: 'Pause',
    icon: 'src/assets/vector/files/nodes/pause.svg',
  },
  {
    label: 'Resume',
    icon: 'src/assets/vector/files/nodes/resume.svg',
  },
  {
    label: 'Stop',
    icon: 'src/assets/vector/files/nodes/stop.svg',
  },
  {
    label: 'Segments',
    icon: 'src/assets/vector/files/nodes/segments.svg',
  },
  {
    label: 'Bounced mail',
    icon: 'src/assets/vector/files/nodes/email-bounce.svg',
  },
  {
    label: 'Email error',
    icon: 'src/assets/vector/files/nodes/email-error.svg',
  },
  {
    label: 'Send email',
    icon: 'src/assets/vector/files/nodes/email-send.svg',
  }
];