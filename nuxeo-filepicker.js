import { LitElement, html } from "lit-element";
import "@nuxeo/nuxeo-elements/nuxeo-connection";
import "@nuxeo/nuxeo-elements/nuxeo-page-provider";
import "@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table";
import "@polymer/paper-button/paper-button";

class NuxeoFilepicker extends LitElement {
  constructor() {
    super();
    this.selectedItems = {};
    this.url = "http://localhost:8080/nuxeo";
    this.username = "Administrator";
    this.password = "Administrator";
    this["page-provider"] = "advanced_document_content";
    this.results = [];
    this.offset = 0;
    this.pageSize = 20;
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
      },
      offset: {
        type: Number
      },
      pageSize: {
        type: Number
      },
      isPreviousPageAvailable: {
        type: Boolean
      },
      isNextPageAvailable: {
        type: Boolean
      }
    };
  }
  render() {
    return html`
      <link rel="stylesheet" href="./nuxeo-filepicker.css" />
      <nuxeo-connection id="nx_connection" url="${this.url}" username="${this.username}" password="${this.password}">
      </nuxeo-connection>

      <nuxeo-resource id="fetchDocument" enrichers="renditions, documentURL, breadcrumb"> </nuxeo-resource>

      <nuxeo-page-provider
        id="provider"
        enrichers="renditions, documentURL, breadcrumb"
        page-size="${this.pageSize}"
        schemas="dublincore, file"
        provider="${this["page-provider"]}"
        headers='{"X-NXfetch.document": "properties", "enrichers.document": "children"}'
      >
      </nuxeo-page-provider>
      <div class="header">
        <paper-input
          id="search_input"
          @keypress="${this._search}"
          always-float-label
          label="Full Text"
          placeholder="Search for something..."
        >
        </paper-input>

        <paper-button raised @click="${this._search}">Search</paper-button>
        <paper-button raised @click="${this._fetchRootChildren}">Browse</paper-button>
        <paper-button raised @click="${this._displayRenditions}">Import Selection(s)</paper-button>
      </div>

      <div class="breadcrumb">
        ${this._breadcrumb().map(
          item =>
            html`
              <span>
                <span>&gt;</span>
                <a href="javascript:undefined" document="${JSON.stringify(item)}" @click="${this._fetchChildren}">
                  <span>${item.title}</span>
                </a>
              </span>
            `
        )}
      </div>

      <div class="documents-container">
        ${this.results.map(
          doc => html`
            <div class="document-container">
              <div class="thumbnailContainer">
                <img class="thumbnail" src=${this._thumbnailUrl(doc)} />
                <div class="thumbnail">${doc.title}</div>
              </div>
              <div class="renditionContainer">
                ${doc.contextParameters.children.entries.length > 0
                  ? html`
                      <paper-button document="${JSON.stringify(doc)}" raised @click="${this._fetchChildren}"
                        >Browse</paper-button
                      >
                    `
                  : html``}
                ${!doc.facets.includes("Folderish")
                  ? html`
                      <nuxeo-data-table
                        name=${doc.uid}
                        title=${doc.title}
                        items="${JSON.stringify(doc.contextParameters.renditions)}"
                        selection-enabled
                        max-items="15"
                        paginable
                        multi-selection
                        @selected-items-changed=${e => this._selectRenditions(e)}
                      >
                        <nuxeo-data-table-column name="">
                          <template>
                            [[item.name]]
                          </template>
                        </nuxeo-data-table-column>
                      </nuxeo-data-table>
                      <paper-button raised @click="${this._displayRenditions}">Import Selection(s)</paper-button>
                    `
                  : html``}
              </div>
            </div>
          `
        )}
      </div>
      <div class="pages">
        ${this.isPreviousPageAvailable
          ? html`
              <a href="javascript:undefined" @click="${this._previous}">
                <iron-icon icon="icons:chevron-left" />
              </a>
            `
          : html``}
        ${this.isNextPageAvailable
          ? html`
              <a href="javascript:undefined" @click="${this._next}">
                <iron-icon icon="icons:chevron-right" />
              </a>
            `
          : html``}
      </div>
      <div>
        <paper-button raised @click="${this._fetchRootChildren}">Browse</paper-button>
        <paper-button raised @click="${this._displayRenditions}">Import Selection(s)</paper-button>
      </div>
    `;
  }

  _previous() {
    this.offset = this.offset - this.pageSize;
    this._fetchPage(this.currentDocument);
  }

  _next() {
    this.offset = this.offset + this.pageSize;
    this._fetchPage(this.currentDocument);
  }

  _fillProps(response) {
    this.isPreviousPageAvailable = response.isPreviousPageAvailable;
    this.offset = response.currentPageOffset;
    this.pageSize = response.pageSize;
    this.numberOfPages = response.numberOfPages;
    this.isNextPageAvailable = response.isNextPageAvailable;
  }

  _fetchPage(currentDocument) {
    var provider = this.shadowRoot.getElementById("provider");
    provider.offset = this.offset;
    provider.params = {
      ecm_parentId: currentDocument.uid
    };
    provider.fetch().then(response => {
      this._fillProps(response);
      this.results = response.entries;
      this.currentDocument = currentDocument;
      this.requestUpdate();
    });
  }

  _fetchRootChildren() {
    var root = this.shadowRoot.getElementById("fetchDocument");
    root.path = "/path//";
    root.get().then(rootDocument => {
      this._fetchPage(rootDocument);
    });
  }

  _fetchChildren(e) {
    var document = JSON.parse(e.currentTarget.getAttribute("document"));
    var fetchDocument = this.shadowRoot.getElementById("fetchDocument");
    fetchDocument.path = `/path${document.path}`;
    fetchDocument.get().then(currentDocument => {
      this._fetchPage(currentDocument);
    });
  }

  _displayRenditions(e) {
    let event = new CustomEvent("filepicker-select-renditions", {
      detail: {
        selectedItems: this.selectedItems
      }
    });
    this.dispatchEvent(event);
  }

  _search(e) {
    if (e.keyCode == 13 || e.type === "click") {
      this.currentDocument = undefined;
      var provider = this.shadowRoot.getElementById("provider");
      var value = this.shadowRoot.getElementById("search_input").value;
      this.pageSize = "-1";
      this.requestUpdate();
      provider.params = {
        title: value
      };
      provider.fetch().then(response => {
        this.results = response.entries;
        this.requestUpdate();
      });
    }
  }

  _selectRenditions(event) {
    if (event.detail.value && event.detail.value.length !== 0 && event.detail.value.indexSplices) {
      var renditions = event.detail.value.indexSplices[0].object;
      renditions = renditions.map(rendition => {
        rendition.title = event.currentTarget.title;
        return rendition;
      });
      this.selectedItems[event.currentTarget.name] = renditions;
    }
  }

  _breadcrumb() {
    if (this.currentDocument) {
      return this.currentDocument.contextParameters.breadcrumb.entries;
    }
    return [];
  }

  _thumbnailUrl(doc) {
    if (doc) {
      const renditionThumbnail = doc.contextParameters.renditions.filter(rendition => rendition.name === "thumbnail");
      return renditionThumbnail[0].url;
    }
  }
}

customElements.define("nuxeo-filepicker", NuxeoFilepicker);
