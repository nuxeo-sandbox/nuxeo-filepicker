import { LitElement, html } from "lit-element";
import "./nuxeo-filepicker";

class MyApp extends LitElement {
  constructor() {
    super();
    this.url = "http://localhost:8080/nuxeo";
    this["page-provider"] = "advanced_document_content";
  }

  static get properties() {
    return {
      url: String,
      pageProvider: String
    }
  }

  render() {
    return html`
    <nuxeo-filepicker
      username="Administrator"
      password="Administrator"
      page-provider="${this["page-provider"]}"
      url="${this.url}"
      @filepicker-select-renditions="${this._callbackRenditions}">
    </nuxeo-filepicker>
    `;
  }

  _callbackRenditions(event) {
    console.log('Selected renditions outside nuxeo-filepicker element:');
    console.log(event.detail.selectedItems);
    console.log('URLs for all renditions:');
    Object.values(event.detail.selectedItems).forEach((renditions) => {
      renditions.forEach((rendition) => {
        console.log(rendition.url);
      })
    });
  }
}

customElements.define("my-app", MyApp);
