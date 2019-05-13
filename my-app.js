import { LitElement, html } from "lit-element";
import "./nuxeo-sitecore";

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
    <nuxeo-sitecore
      username="Administrator"
      password="Administrator"
      page-provider="${this["page-provider"]}"
      url="${this.url}"
      @sitecore-select-renditions="${this._callbackRenditions}">
    </nuxeo-sitecore>
    `;
  }

  _callbackRenditions(event) {
    console.log('Selected renditions outside nuxeo-sitecore element:');
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
