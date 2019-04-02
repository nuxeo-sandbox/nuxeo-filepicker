import { LitElement, css, html } from "lit-element";
import "@nuxeo/nuxeo-elements/nuxeo-connection";
import "@nuxeo/nuxeo-elements/nuxeo-page-provider";
import "@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table";
import "@polymer/paper-button/paper-button";

class NuxeoSitecore extends LitElement {
  constructor() {
    super();
    this.selectedItems = [];
    this.url = 'http://localhost:8080/nuxeo';
    this.username = 'Administrator';
    this.password = 'Administrator';
  }
  static get properties() {
    return {
      selectedItems: {
        type: Object
      },
      url: {
        type: String
      },
      username: {
        type: String
      },
      password: {
        type: String
      }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
        nuxeo-data-table {
          height: calc(100vh - 222px);
          overflow: hidden;
        }
      }
    `;
  }
  render() {
    return html`
      <nuxeo-connection
        id="nx_connection"
        url="${this.url}"
        username="${this.username}"
        password="${this.password}"
      >
      </nuxeo-connection>

      <nuxeo-page-provider
        id="provider"
        enrichers="renditions, documentURL"
        auto
        page-size="20"
        schemas="dublincore, file"
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
        @selected-items-changed=${e => this._select(e)}
      >
        <nuxeo-data-table-column name="Title" flex="100">
          <template>
            [[item.title]]
          </template>
        </nuxeo-data-table-column>
      </nuxeo-data-table>
      <paper-button @click="${this._action}">Action</paper-button>
    `;
  }
  _select(event) {
    if (event.detail.value && Array.isArray(event.detail.value)) {
      this.selectedItems = event.detail.value;
    }
  }
  _action(e) {
    let event = new CustomEvent('sitecore-select', {
      detail: {
        selectedItems: this.selectedItems
      }
    });
    this.dispatchEvent(event);
    console.log('Selected items from within nuxeo-sitecore element:') 
    console.log(this.selectedItems);
  }
}

customElements.define("nuxeo-sitecore", NuxeoSitecore);
