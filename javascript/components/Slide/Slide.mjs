const templateHTML = `
  <style>@import "/javascript/components/Slide/Slide.css";</style>
  <figure class="content">
    <slot name="content"></slot>
    <figcaption class="caption">
      <span>
        <slot name="caption"></slot>
      </span>
    </figcaption>
  </figure>
`;


class Slide extends HTMLLIElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    console.log(this.shadowRoot);

    console.log('constructor: ');
  }

  connectedCallback() {
    const template = document.createElement('TEMPLATE');
    template.innerHTML = templateHTML;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

}

customElements.define('slide-element', Slide, {extends: 'li'});
