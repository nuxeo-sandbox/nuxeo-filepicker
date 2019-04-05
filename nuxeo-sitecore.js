import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import "@nuxeo/nuxeo-elements/nuxeo-connection";
import "@nuxeo/nuxeo-elements/nuxeo-page-provider";
import "@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table";

class NuxeoSitecore extends PolymerElement {
  static get properties() {
    return {
      selectedItems: {
        type: Array,
        value: []
      }
    };
  }
  static get template() {
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
        selected-items={{selectedItems}}
      >
        <nuxeo-data-table-column name="Title" flex="100">
          <template>
            [[item.title]]
          </template>
        </nuxeo-data-table-column>
      </nuxeo-data-table>
      <button onclick="[[_action]]">Action</button>
    `;
  }
  _action(e) {
    console.log(this.selectedItems);
  }
}

customElements.define("nuxeo-sitecore", NuxeoSitecore);
