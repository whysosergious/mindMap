// temp data
import { testdata } from "./data/ex.js";


// global controller
export const _gc = {
  dev: {},
  initNodeMod: 0,
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
      activeTool: 'cursor',
      activeMenu: null,
      activeSoftMenu: null,
      closeAllSoftWindows: null
    },
    nodeMenu: {
      x: 0,
      y: 0,
      show: false
    },
    contextMenu: {
      x: 0,
      y: 0,
      show: false
    }
  },
  defaults: {
    nodes: {
      setup: {
        h: 100,
        w: 100
      },
      process: {
        h: 80,
        w: 80
      },
      state: {
        h: 80,
        w: 80
      },
      modifier: {
        h: 60,
        w: 60
      }
    }
  },
  selected: {
    el: null,
    node: null
  },
  sharedMethods: {
    calcRelPoint(line) {
      let ey = line.points.length === 0 ? line.ey : line.points[0].y,
        ex = line.points.length === 0 ? line.ex : line.points[0].x

      let disY = ey - line.y,
        disX = ex - line.x,
        dis = Math.sqrt((disX*disX) + (disY*disY));

      line.rel.x = ~~(_data.nodes[line.connFrom].w*0.75*disX/dis);
      line.rel.y = ~~(_data.nodes[line.connFrom].h*0.75*disY/dis);
    },
    calcRelEndPoint(line) {
      let y = line.points.length === 0 ? line.y : line.points[line.points.length-1].y,
        x = line.points.length === 0 ? line.x : line.points[line.points.length-1].x;

      let disY = line.ey - y,
        disX = line.ex - x,
        dis = Math.sqrt((disX*disX) + (disY*disY));

      line.rel.ex = ~~(_data.nodes[line.connTo].w*0.75*disX/dis);
      line.rel.ey = ~~(_data.nodes[line.connTo].h*0.75*disY/dis);

      this.calcRelRotation(line, x, y);
    },
    calcRelRotation(line, x, y) {
      if (!x || !y) {
        y = line.points.length === 0 ? line.y : line.points[line.points.length-1].y;
        x = line.points.length === 0 ? line.x : line.points[line.points.length-1].x;
      }

      line.rel.ed = ~~(Math.atan2(y - line.ey, x - line.ex) * 180 / Math.PI);
    },
    parseActionData: obj => {
      let cache = {},
        result = {},
        nodes = obj.nodes,
        stepCount = 0;
    
      const parse = (nextId, prevId) => {
        let node = nodes[nextId];
    
        if (result[nextId]) {
          if (cache[nextId] === prevId) {
            console.log('FFFF')
            result[nextId].repeat = true; // temp..
          }
          cache[nextId] = prevId
          return;
        }

        result[nextId] = {
          odrinal: stepCount++,
          label: node.label,
          type: node.type,
          value: node.value,
          data: node.data,
          steps: []
        }
    
        Object.values(node.linesTo).forEach(line => {
          result[nextId].steps.push(line.nodeId);
          parse(line.nodeId, nextId);
        });
      }

      if (!obj.initial)
        return 'Set a starting point node by \nright-clicking and selecting "Make Initial"';

      parse(obj.initial);
    
      return result;
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

// custom methods
/** Parse Mind Map data */
JSON.stringifyMap = (obj, indent = 1) => {
  let cache = [];
  const result = JSON.stringify(
    obj,
    (key, value) =>
      /^hitboxes$|^el$|^altClass$/.test(key) ? undefined :
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined 
          : cache.push(value) && value
        : value,
    indent
  );
  cache = null;
  return result;
}

// default data object
export let _data = {
  count: 0,
  initial: null,
  nodes: {},
  lines: {},
  note: ''
}

_gc.defaults.data = JSON.stringify(_data);

// simulate api data
// _data = testdata;

window.data = _data;

// web components
export let _web = {
  count: 0,
  nodes: {}
}

// preset nodes
export const _presetNodes = [
  {
    id: null,
    label: 'Email',
    icon: 'src/assets/vector/files/nodes/email.svg',
    type: 'setup',
    action: 'SelectIssue',
    value: 'My Issue',
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Event',
    icon: 'src/assets/vector/files/nodes/event.svg',
    type: 'setup',
    action: 'SelectEvent',
    value: 'My Event ID',
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Survey',
    icon: 'src/assets/vector/files/nodes/survey.svg',
    type: 'setup',
    action: 'SelectSurvey',
    value: 'My Survey ID',
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Form',
    icon: 'src/assets/vector/files/nodes/form.svg',
    type: 'setup',
    action: 'SelectForm',
    value: 'My Form ID',
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Sms',
    icon: 'src/assets/vector/files/nodes/sms.svg',
    type: 'setup',
    action: 'SelectMessage',
    value: 'My Message ID',
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Send',
    icon: 'src/assets/vector/files/nodes/send.svg',
    type: 'process',
    action: 'SendAll',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Send email',
    icon: 'src/assets/vector/files/nodes/email-send.svg',
    type: 'process',
    action: 'SendEmail',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Segments',
    icon: 'src/assets/vector/files/nodes/segments.svg',
    type: 'process',
    action: 'SegmentResult',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Opened email',
    icon: 'src/assets/vector/files/nodes/email-open.svg',
    type: 'state',
    action: 'EmailOpened',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Bounced email',
    icon: 'src/assets/vector/files/nodes/email-bounce.svg',
    type: 'state',
    action: 'EmailBounced',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Email error',
    icon: 'src/assets/vector/files/nodes/email-error.svg',
    type: 'state',
    action: 'EmailGeneralError',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Time mod',
    icon: 'src/assets/vector/files/nodes/time-mod.svg',
    type: 'modifier',
    action: 'TimeMod',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Condition',
    icon: 'src/assets/vector/files/nodes/if-mod.svg',
    type: 'modifier',
    action: 'IfMod',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Pause',
    icon: 'src/assets/vector/files/nodes/pause.svg',
    type: 'modifier',
    action: 'PauseMod',
    value: null,
    data: {},
    note: ''
  },
  {
    label: 'Start',
    icon: 'src/assets/vector/files/nodes/resume.svg',
    type: 'modifier',
    action: 'StartMod',
    value: null,
    data: {},
    note: ''
  },
  {
    id: null,
    label: 'Stop',
    icon: 'src/assets/vector/files/nodes/stop.svg',
    type: 'modifier',
    action: 'StopMod',
    value: null,
    data: {},
    note: ''
  }
];