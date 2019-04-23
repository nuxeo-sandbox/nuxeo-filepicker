import { LitElement, css, html } from "lit-element";
import "@nuxeo/nuxeo-elements/nuxeo-connection";
import "@nuxeo/nuxeo-elements/nuxeo-page-provider";
import "@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table";
import "@polymer/paper-button/paper-button";

class NuxeoSitecore extends LitElement {
  constructor() {
    super();
    this.selectedItems = {};
    this.url = 'http://localhost:8080/nuxeo';
    this.username = 'Administrator';
    this.password = 'Administrator';
    this['page-provider'] = 'default_document_suggestion';
    this.results = [];
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
      },
      'page-provider': {
        type: String
      },
      results: {
        type: Array
      },
    };
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
        page-size="20"
        schemas="dublincore, file"
        params='{"queryParams": ""}'
        provider="${this['page-provider']}"
        headers='{"X-NXfetch.document": "properties"}'
      >
      </nuxeo-page-provider>

      ${this.results.map((doc) => html`
        <h2>${doc.title}</h2>
        <nuxeo-data-table
        name=${doc.uid}
        items="${JSON.stringify(doc.contextParameters.renditions)}"
        selection-enabled
        max-items="15"
        paginable
        multi-selection
        @selected-items-changed=${e => this._selectRenditions(e)}
      >
        <nuxeo-data-table-column name="Title" flex="100">
          <template>
            [[item.name]]
          </template>
        </nuxeo-data-table-column>
      </nuxeo-data-table>
      `)}
      <div>
        <paper-button raised @click="${this._fetch}">Fetch</paper-button>
        <paper-button raised @click="${this._displayRenditions}">Display Renditions in Console</paper-button>
      </div>
    `;
  }

  _selectRenditions(event) {
    if (event.detail.value && event.detail.value.length !== 0 && event.detail.value.indexSplices) {
      this.selectedItems[event.currentTarget.name] = event.detail.value.indexSplices[0].object;
    }
  }

  _fetch() {
    this.shadowRoot.getElementById('provider').fetch().then((response) => {
      this.results = response.entries;
      this.requestUpdate();
    });
  }

  _displayRenditions(e) {
    let event = new CustomEvent('sitecore-select-renditions', {
      detail: {
        selectedItems: this.selectedItems
      }
    });
    this.dispatchEvent(event);
  }
}

customElements.define("nuxeo-sitecore", NuxeoSitecore);
