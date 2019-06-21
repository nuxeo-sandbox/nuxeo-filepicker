function _templateObject_298b04b066ae11e989833d28cc3c6314() {
  var data = babelHelpers.taggedTemplateLiteral(["\n    <nuxeo-sitecore\n      username=\"Administrator\"\n      password=\"Administrator\"\n      page-provider=\"default_document_suggestion\"\n      url=\"http://localhost:8080/nuxeo\"\n      @sitecore-select-renditions=\"", "\">\n    </nuxeo-sitecore>\n    "]);

  _templateObject_298b04b066ae11e989833d28cc3c6314 = function _templateObject_298b04b066ae11e989833d28cc3c6314() {
    return data;
  };

  return data;
}

import { LitElement, html } from "./node_modules/lit-element/lit-element.js";
import "./nuxeo-sitecore.js";

var MyApp =
/*#__PURE__*/
function (_LitElement) {
  babelHelpers.inherits(MyApp, _LitElement);

  function MyApp() {
    babelHelpers.classCallCheck(this, MyApp);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MyApp).apply(this, arguments));
  }

  babelHelpers.createClass(MyApp, [{
    key: "render",
    value: function render() {
      return html(_templateObject_298b04b066ae11e989833d28cc3c6314(), this._callbackRenditions);
    }
  }, {
    key: "_callbackRenditions",
    value: function _callbackRenditions(event) {
      console.log('Selected renditions outside nuxeo-sitecore element:');
      console.log(event.detail.selectedItems);
      console.log('URLs for all renditions:');
      Object.values(event.detail.selectedItems).forEach(function (renditions) {
        renditions.forEach(function (rendition) {
          console.log(rendition.url);
        });
      });
    }
  }]);
  return MyApp;
}(LitElement);

customElements.define("my-app", MyApp);