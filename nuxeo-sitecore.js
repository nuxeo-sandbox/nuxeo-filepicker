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
    this['page-provider'] = 'assets_search';
    this.results = [];
    this.displaySearch = false;
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
      'page-provider-asset': {
        type: String
      },
      results: {
        type: Array
      },
      displaySearch: {
        type: Boolean
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

      <nuxeo-resource
        id="root"
        path="/path//">
      </nuxeo-resource>

      <nuxeo-page-provider
        id="provider-asset"
        enrichers="renditions, documentURL"
        page-size="20"
        schemas="dublincore, file"
        provider="${this['page-provider-asset']}"
        headers='{"X-NXfetch.document": "properties", "enrichers.document": "children"}'
      >
      </nuxeo-page-provider>

      <nuxeo-page-provider
        id="provider"
        enrichers="renditions, documentURL"
        page-size="20"
        schemas="dublincore, file"
        provider="${this['page-provider']}"
        headers='{"X-NXfetch.document": "properties", "enrichers.document": "children"}'
      >
      </nuxeo-page-provider>
      ${this.displaySearch? 
        html`<paper-input @keypress="${this._search}" always-float-label label="Full Text" placeholder="Search for something...">
        </paper-input>`:
        html``
      }
      ${this.results.map((doc) => html`
        <h2>${doc.title}</h2>
        ${doc.contextParameters.children.entries.length > 0? 
          html`<paper-button id="${doc.uid}" raised @click="${this._fetchChildren}">Browse</paper-button>`:
          html``
        }
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
        <paper-button raised @click="${this._fetchAsset}">Fetch Asset</paper-button>
        <paper-button raised @click="${this._fetchRootChildren}">Browse</paper-button>
        <paper-button raised @click="${this._displayRenditions}">Display Renditions in Console</paper-button>
      </div>
    `;
  }

  _selectRenditions(event) {
    if (event.detail.value && event.detail.value.length !== 0 && event.detail.value.indexSplices) {
      this.selectedItems[event.currentTarget.name] = event.detail.value.indexSplices[0].object;
    }
  }

  _fetchAsset() {
    this.displaySearch = true;
    this.shadowRoot.getElementById('provider-asset').fetch().then((response) => {
      this.results = response.entries;
      this.requestUpdate();
    });
  }

  _fetchRootChildren() {
    this.displaySearch = false;
    var root = this.shadowRoot.getElementById('root');
    root.get().then((response) => {
      var provider = this.shadowRoot.getElementById('provider');
      provider.params = {
        queryParams: response.uid,
      }
      provider.fetch().then((response) => {
        this.results = response.entries;
        this.requestUpdate();
      });
    });
  }

  _fetchChildren(e) {
    var parentId = e.currentTarget.id;
    var provider = this.shadowRoot.getElementById('provider');
    provider.params = {
      queryParams: parentId,
    }
    provider.fetch().then((response) => {
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

  _search(e) {
    if (e.keyCode == 13) {
      var value = e.currentTarget.value;
      var provider = this.shadowRoot.getElementById('provider-asset');
      provider.params = {
        ecm_fulltext: value
      }
      provider.fetch().then((response) => {
        this.results = response.entries;
        this.displaySearch = true;
        this.requestUpdate();
      });
    }
  }
}

customElements.define("nuxeo-sitecore", NuxeoSitecore);
