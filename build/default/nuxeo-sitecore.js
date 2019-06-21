function _templateObject2_29a7db8066ae11e989833d28cc3c6314() {
  var data = babelHelpers.taggedTemplateLiteral(["\n        <h2>", "</h2>\n        <nuxeo-data-table\n        name=", "\n        items=\"", "\"\n        selection-enabled\n        max-items=\"15\"\n        paginable\n        multi-selection\n        @selected-items-changed=", "\n      >\n        <nuxeo-data-table-column name=\"Title\" flex=\"100\">\n          <template>\n            [[item.name]]\n          </template>\n        </nuxeo-data-table-column>\n      </nuxeo-data-table>\n      "]);

  _templateObject2_29a7db8066ae11e989833d28cc3c6314 = function _templateObject2_29a7db8066ae11e989833d28cc3c6314() {
    return data;
  };

  return data;
}

function _templateObject_29a7db8066ae11e989833d28cc3c6314() {
  var data = babelHelpers.taggedTemplateLiteral(["\n      <nuxeo-connection\n        id=\"nx_connection\"\n        url=\"", "\"\n        username=\"", "\"\n        password=\"", "\"\n      >\n      </nuxeo-connection>\n\n      <nuxeo-page-provider\n        id=\"provider\"\n        enrichers=\"renditions, documentURL\"\n        page-size=\"20\"\n        schemas=\"dublincore, file\"\n        params='{\"queryParams\": \"\"}'\n        provider=\"", "\"\n        headers='{\"X-NXfetch.document\": \"properties\"}'\n      >\n      </nuxeo-page-provider>\n\n      ", "\n      <div>\n        <paper-button raised @click=\"", "\">Fetch</paper-button>\n        <paper-button raised @click=\"", "\">Display Renditions in Console</paper-button>\n      </div>\n    "]);

  _templateObject_29a7db8066ae11e989833d28cc3c6314 = function _templateObject_29a7db8066ae11e989833d28cc3c6314() {
    return data;
  };

  return data;
}

import { LitElement, css, html } from "./node_modules/lit-element/lit-element.js";
import "./node_modules/@nuxeo/nuxeo-elements/nuxeo-connection.js";
import "./node_modules/@nuxeo/nuxeo-elements/nuxeo-page-provider.js";
import "./node_modules/@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table.js";
import "./node_modules/@polymer/paper-button/paper-button.js";

var NuxeoSitecore =
/*#__PURE__*/
function (_LitElement) {
  babelHelpers.inherits(NuxeoSitecore, _LitElement);

  function NuxeoSitecore() {
    var _this;

    babelHelpers.classCallCheck(this, NuxeoSitecore);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(NuxeoSitecore).call(this));
    _this.selectedItems = {};
    _this.url = 'http://localhost:8080/nuxeo';
    _this.username = 'Administrator';
    _this.password = 'Administrator';
    _this['page-provider'] = 'default_document_suggestion';
    _this.results = [];
    return _this;
  }

  babelHelpers.createClass(NuxeoSitecore, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return html(_templateObject_29a7db8066ae11e989833d28cc3c6314(), this.url, this.username, this.password, this['page-provider'], this.results.map(function (doc) {
        return html(_templateObject2_29a7db8066ae11e989833d28cc3c6314(), doc.title, doc.uid, JSON.stringify(doc.contextParameters.renditions), function (e) {
          return _this2._selectRenditions(e);
        });
      }), this._fetch, this._displayRenditions);
    }
  }, {
    key: "_selectRenditions",
    value: function _selectRenditions(event) {
      if (event.detail.value && event.detail.value.length !== 0 && event.detail.value.indexSplices) {
        this.selectedItems[event.currentTarget.name] = event.detail.value.indexSplices[0].object;
      }
    }
  }, {
    key: "_fetch",
    value: function _fetch() {
      var _this3 = this;

      this.shadowRoot.getElementById('provider').fetch().then(function (response) {
        _this3.results = response.entries;

        _this3.requestUpdate();
      });
    }
  }, {
    key: "_displayRenditions",
    value: function _displayRenditions(e) {
      var event = new CustomEvent('sitecore-select-renditions', {
        detail: {
          selectedItems: this.selectedItems
        }
      });
      this.dispatchEvent(event);
    }
  }], [{
    key: "properties",
    get: function get() {
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
        }
      };
    }
  }]);
  return NuxeoSitecore;
}(LitElement);

customElements.define("nuxeo-sitecore", NuxeoSitecore);