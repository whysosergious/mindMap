// global controller
export const _gc = {
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
      activeMenu: 'dev' // null this
    },
    nodeMenu: {
      x: 0,
      y: 0,
      show: false
    }
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

      line.rel.ed = Math.atan2(y - line.ey, x - line.ex) * 180 / Math.PI;
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
JSON.stringifyMap = (obj, indent = 1) => {
  let cache = [];
  const retVal = JSON.stringify(
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
  return retVal;
};



// dummy node data
export let _data = {
  nodes: {
    ugn0: {
      id: `ugn0`,
      label: 'Email',
      icon: 'src/assets/vector/files/nodes/email.svg',
      h: 100,
      w: 100,
      y: 930,
      x: 1371,
      z: 50,
      linesTo: {},
      linesFrom: {}
    }
  },
  lines: {}
}
let dummy = JSON.stringify({
  "count": 20,
  "nodes": {
   "ugn0": {
    "id": "ugn0",
    "label": "Email",
    "icon": "src/assets/vector/files/nodes/email.svg",
    "h": 100,
    "w": 100,
    "y": 1039,
    "x": 1324,
    "z": 14,
    "linesTo": {
     "ugl4": {
      "lineId": "ugl4",
      "nodeId": "ugn2"
     }
    },
    "linesFrom": {
     "ugl6": {
      "lineId": "ugl6",
      "nodeId": "ugn3"
     }
    }
   },
   "ugn2": {
    "label": "Survey",
    "icon": "src/assets/vector/files/nodes/survey.svg",
    "h": 100,
    "w": 100,
    "y": 809,
    "x": 1513,
    "z": 17,
    "linesTo": {},
    "linesFrom": {
     "ugl4": {
      "lineId": "ugl4",
      "nodeId": "ugn0"
     },
     "ugl5": {
      "lineId": "ugl5",
      "nodeId": "ugn3"
     }
    },
    "id": "ugn2"
   },
   "ugn3": {
    "label": "Send email",
    "icon": "src/assets/vector/files/nodes/email-send.svg",
    "h": 100,
    "w": 100,
    "y": 817,
    "x": 1061,
    "z": 18,
    "linesTo": {
     "ugl5": {
      "lineId": "ugl5",
      "nodeId": "ugn2"
     },
     "ugl6": {
      "lineId": "ugl6",
      "nodeId": "ugn0"
     }
    },
    "linesFrom": {},
    "id": "ugn3"
   }
  },
  "lines": {
   "ugl4": {
    "id": "ugl4",
    "altClass": null,
    "x": 1374,
    "y": 1089,
    "ex": 1563,
    "ey": 859,
    "rel": {
     "x": -4,
     "y": -74,
     "ex": 74,
     "ey": 0
    },
    "points": [
     {
      "id": "ugl4p8",
      "x": 1359,
      "y": 860
     }
    ],
    "deleteBtn": {
     "x": 1367,
     "y": 985
    },
    "optionsBtn": {
     "x": 1365,
     "y": 945
    },
    "connFrom": "ugn0",
    "connTo": "ugn2"
   },
   "ugl5": {
    "id": "ugl5",
    "altClass": null,
    "x": 1111,
    "y": 867,
    "ex": 1563,
    "ey": 859,
    "rel": {
     "x": 45,
     "y": -59,
     "ex": 49,
     "ey": 56
    },
    "points": [
     {
      "id": "ugl5p7",
      "x": 1325,
      "y": 591
     }
    ],
    "deleteBtn": {
     "x": 1174,
     "y": 784
    },
    "optionsBtn": {
     "x": 1199,
     "y": 752
    },
    "connTo": "ugn2",
    "connFrom": "ugn3"
   },
   "ugl6": {
    "id": "ugl6",
    "altClass": null,
    "x": 1111,
    "y": 867,
    "ex": 1374,
    "ey": 1089,
    "rel": {
     "x": 75,
     "y": 0,
     "ex": 24,
     "ey": 71
    },
    "points": [
     {
      "id": "ugl6p9",
      "x": 1299,
      "y": 867
     }
    ],
    "deleteBtn": {
     "x": 1216,
     "y": 867
    },
    "optionsBtn": {
     "x": 1256,
     "y": 867
    },
    "connFrom": "ugn3",
    "connTo": "ugn0"
   }
  }
 });

_data = JSON.parse(dummy);


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
];