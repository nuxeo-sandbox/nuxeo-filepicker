import { LitElement, css, html } from "lit-element";
import "@nuxeo/nuxeo-elements/nuxeo-connection";
import "@nuxeo/nuxeo-elements/nuxeo-page-provider";
import "@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table";
import "@polymer/paper-button/paper-button";

class NuxeoSitecore extends LitElement {
  constructor() {
    super();
    this.selectedItems = {};
    this.url = "http://localhost:8080/nuxeo";
    this.username = "Administrator";
    this.password = "Administrator";
    this["page-provider"] = "advanced_document_content";
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
      "page-provider": {
        type: String
      },
      results: {
        type: Array
      }
    };
  }
  render() {
    return html`
      <nuxeo-connection id="nx_connection" url="${this.url}" username="${this.username}" password="${this.password}">
      </nuxeo-connection>

      <nuxeo-resource id="fetchDocument" enrichers="renditions, documentURL, breadcrumb"> </nuxeo-resource>

      <nuxeo-page-provider
        id="provider"
        enrichers="renditions, documentURL, breadcrumb"
        page-size="20"
        schemas="dublincore, file"
        provider="${this["page-provider"]}"
        headers='{"X-NXfetch.document": "properties", "enrichers.document": "children"}'
      >
      </nuxeo-page-provider>

      <paper-input
        id="search_input"
        @keypress="${this._search}"
        always-float-label
        label="Full Text"
        placeholder="Search for something..."
      >
      </paper-input>

      <paper-button raised @click="${this._search}">Search</paper-button>

      <div>
        ${this._breadcrumb().map(
          item =>
            html`
              <span>
                <span>&gt;</span>
                <a href="#" document="${JSON.stringify(item)}" @click="${this._fetchChildren}">
                  <span>${item.title}</span>
                </a>
              </span>
            `
        )}
      </div>

      ${this.results.map(
        doc => html`
          <h2>${doc.title}</h2>
          ${doc.contextParameters.children.entries.length > 0
            ? html`
                <paper-button document=${JSON.stringify(doc)} raised @click="${this._fetchChildren}">Browse</paper-button>
              `
            : html``}
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
        `
      )}
      <div>
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

  _breadcrumb() {
    if (this.currentDocument) {
      return this.currentDocument.contextParameters.breadcrumb.entries;
    }
    return [];
  }

  _fetchRootChildren() {
    var root = this.shadowRoot.getElementById("fetchDocument");
    root.path = '/path//';
    root.get().then(rootDocument => {
      var provider = this.shadowRoot.getElementById("provider");
      provider.params = {
        ecm_parentId: rootDocument.uid
      };
      provider.fetch().then(response => {
        this.results = response.entries;
        this.currentDocument = rootDocument;
        this.requestUpdate();
      });
    });
  }

  _fetchChildren(e) {
    var document = JSON.parse(e.currentTarget.getAttribute('document'));
    var fetchDocument = this.shadowRoot.getElementById("fetchDocument");
    fetchDocument.path = `/path${document.path}`;
    fetchDocument.get().then(currentDocument => {
      var provider = this.shadowRoot.getElementById("provider");
      provider.params = {
        ecm_parentId: currentDocument.uid
      };
      provider.fetch().then(response => {
        this.results = response.entries;
        this.currentDocument = currentDocument;
        this.requestUpdate();
      });
    });
  }

  _displayRenditions(e) {
    let event = new CustomEvent("sitecore-select-renditions", {
      detail: {
        selectedItems: this.selectedItems
      }
    });
    this.dispatchEvent(event);
  }

  _search(e) {
    if (e.keyCode == 13 || e.type === "click") {
      var provider = this.shadowRoot.getElementById("provider");
      var value = this.shadowRoot.getElementById("search_input").value;
      provider.params = {
        title: value
      };
      provider.fetch().then(response => {
        this.results = response.entries;
        this.requestUpdate();
      });
    }
  }
}

customElements.define("nuxeo-sitecore", NuxeoSitecore);
