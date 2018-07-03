/**
 * Component that automagically finds sibling <template>
 * to the instance script and uses it for rendering, with
 * out without the getState form the instace of the child.
 *
 * @class Component
 * @extends {HTMLElement}
 */
export class Component extends HTMLElement {
  constructor (componentPath) {
    super();

    const slashParts = componentPath.split('/');
    const componentName = slashParts.pop().split('.')[0];

    this.componentPath = componentPath;
    this.componentName = componentName;
  }

  get sDOM () {
    return this._shadowDOM;
  }

  get template () {
    return undefined;
  }

  get stylesheet () {
    return undefined;
  }

  async fetchSiblingFileAsText (fileName) {
    const response = await fetch(new URL(fileName, this.componentPath));

    if (!response.ok) {
      throw new Error(`Could not fetch ${fileName}`);
    }

    const text = await response.text();

    return text;
  }

  connectedCallback () {
    this.render();
  }

  /**
   *
   * @param {string} query
   * @return {Element}
   */
  $ (query) {
    return this._shadowDOM.querySelector(query);
  }

  getState () {}
  postRender () {}

  async getStyle () {
    if (this.stylesheet) {
      return this.stylesheet;
    }

    try {
      const text = await this.fetchSiblingFileAsText(`./${this.componentName}.css`);

      return text;
    } catch (error) {
      return this.stylesheet;
    }
  }

  async getTemplate () {
    if (this.template) {
      return this.template;
    }

    try {
      const text = await this.fetchSiblingFileAsText(`./${this.componentName}.html`);

      return text;
    } catch (error) {
      return this.stylesheet;
    }
  }

  async render () {
    let state;

    // Not required on child component
    if (this.getState) {
      state = await this.getState();
    }

    const style = await this.getStyle();
    const template = await this.getTemplate();

    let css = '';

    if (style) {
      css = style.includes('<style>') ? style : `<style>${style}</style>`;
    }

    let html = '';

    if (template) {
      html = template;
    }

    const templator = (t, d) => new Function('return `' + t + '`').call(d); // eslint-disable-line no-new-func

    const shadowDOM = this._shadowDOM || this.attachShadow({ mode: 'closed' });

    this._shadowDOM = shadowDOM;

    shadowDOM.innerHTML = templator(css + html, state);

    if (this.postRender) {
      this.postRender();
    }
  }
}

export default { Component };