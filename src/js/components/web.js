function snakeToCamelCase(str) {
  return str.replace(/(\s|\t|_)([a-z])/g, g => g[1].toUpperCase());
}

function stringToElements (string) {
  const fragment = document.createRange().createContextualFragment(string);

  return [...fragment.children];
}

export function html(literals, ...rest) {
  return literals
    .reduce((acc, cur, i) => acc.concat(cur, rest[i]), [])
    .join('');
}

export function registerComponent(classInstace) {
  const kebabName = classInstace.prototype.constructor.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  customElements.define(kebabName, classInstace);

  return kebabName;
}

export class Component extends HTMLElement {
  constructor (componentPath) {
    super();

    this.componentPath = componentPath;
  }

  set state (updates) {
    this._state = Object.freeze({
      ...(this._state || {}),
      ...updates
    });

    if (this.render) {
      this._render();
    }
  }

  get state () {
    return this._state;
  }

  get cssPath () {
    return this.componentPath.replace(/\.js/gi, '.css');
  }

  get htmlPath () {
    return this.componentPath.replace(/\.js/gi, '.html');
  }

  get props() {
    return this.attributes
      ? Array.from(this.attributes).reduce(
          (cur, { localName, value }) => ({
            ...cur,
            [snakeToCamelCase(localName)]: value,
          }),
          {},
        )
      : {};
  }

  async _render () {
    const response = await fetch(this.cssPath);
    const css = await response.text();
    const cssText = response.headers.get('content-type').indexOf('text/css') !== -1 ? css : '';

    this._sDOM.innerHTML = `<style>${cssText}</style>`;

    stringToElements(this.render(this.props)).forEach(child => {
      this._sDOM.appendChild(child);
    });
  }

  async _renderHTMLFile () {
    const fetchCSS = fetch(this.cssPath);
    const fetchHTML = fetch(this.htmlPath);

    const responseCSS = await fetchCSS;
    const responseHTML = await fetchHTML;

    const css = await responseCSS.text();
    const html = await responseHTML.text();

    const cssText = responseCSS.headers.get('content-type').indexOf('text/css') !== -1 ? css : '';

    this._sDOM.innerHTML = `<style>${cssText}</style>`;

    stringToElements(html).forEach(child => {
      this._sDOM.appendChild(child);
    });
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate() {}
  componentDidMount() {}

  async attributeChangedCallback() {
    console.log('attributeChangedCallback');

    if (this.render) {
      await this._render();
    } else {
      await this_.renderHTMLFile();
    }

    if (this.componentDidUpdate) {
      this.componentDidUpdate();
    }
  }

  async connectedCallback() {
    this._sDOM = this.attachShadow({ mode: 'closed' });

    if (this.render) {
      await this._render();
    } else {
      await this._renderHTMLFile();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.componentDidMount) {
          this.componentDidMount();
        }
      });
    });
  }
}
