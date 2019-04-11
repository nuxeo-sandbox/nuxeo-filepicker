import { LitElement, html } from "lit-element";
import "./nuxeo-sitecore";

class MyApp extends LitElement {
  render() {
    return html`
    <nuxeo-sitecore
      username="Administrator"
      password="Administrator"
      page-provider="default_document_suggestion"
      url="http://localhost:8080/nuxeo"
      @sitecore-select="${this._callback}">
    </nuxeo-sitecore>
    `;
  }
  _callback(event) {
    console.log('Selected items outside nuxeo-sitecore element:');
    console.log(event.detail.selectedItems);
  }
}

customElements.define("my-app", MyApp);
