import { LitElement, css, html } from "lit-element";
import "@nuxeo/nuxeo-elements/nuxeo-connection";
import "@nuxeo/nuxeo-elements/nuxeo-page-provider";
import "@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table";

class NuxeoSitecore extends LitElement {
  constructor() {
    super();
    this.selectedItems = [];
  }
  static get properties() {
    return {
      selectedItems: {
        type: Object
      }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }
  render() {
    return html`
      <nuxeo-connection
        id="nx_connection"
        url="http://localhost:8080/nuxeo"
        username="Administrator"
        password="Administrator"
      >
      </nuxeo-connection>

      <nuxeo-page-provider
        id="provider"
        enrichers="renditions"
        auto
        page-size="20"
        schemas="dublincore"
        params='{"queryParams": ""}'
        provider="default_document_suggestion"
        headers='{"X-NXfetch.document": "properties"}'
      >
      </nuxeo-page-provider>

      <nuxeo-data-table
        id="datatable"
        nx-provider="provider"
        selection-enabled
        max-items="15"
        paginable
        multi-selection
        @selected=${(e) => this._select(e)}
      >
        <nuxeo-data-table-column name="Title" flex="100">
          <template>
            [[item.title]]
          </template>
        </nuxeo-data-table-column>
      </nuxeo-data-table>
      <button @click="${this._action}">Action</button>
    `;
  }
  _select(e){
    this.selectedItems.push(e);
  }
  _action(e) {
    console.log(this.selectedItems);
  }
}

customElements.define("nuxeo-sitecore", NuxeoSitecore);
