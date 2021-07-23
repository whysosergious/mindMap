// global controller
export const _gc = {
  count: 0,
  templates: {},
  viewport: {
    perspective: 400
  },
  /** Fetching html templates as string */
  getTemplate: async function(name) {
    const ext = '.cshtml';

    return fetch(`src/components/${ name }/${ name }${ ext }`)
      .then(response => response.text())
      .then(data => this.templates[name] = data)
      .catch(data => console.debug(`Fetch failed: ${ data.reason }`));
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