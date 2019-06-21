/**

Copyright 2016 Google Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

### Styling

The following custom properties and mixins are also available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-font-common-base`| default font base | `default`
`--paper-input-container-color`| input container text color | `--secondary-text-color`
`--paper-typeahead-results-layer-max-height` | max height for the results | `auto`
`--paper-typeahead-results` | typeahead result mixin | `{}`
`--paper-typeahead-result-selected-background` | typeahead result selected background | `--paper-indigo-50`
`--paper-typeahead-result-pressed` | paper item pressed mixin | `{}`
`--paper-typeahead-divider-color` | paper item result color divider | `--divider-color`
`--paper-typeahead-result-min-height` | min height of a result |  `30px`
`--paper-typeahead-selected-weight` | font-weight of a single result | `normal`
`--paper-typeahead-result-selected` | selected style mixin | `{}`
`--paper-typeahead-result-focused` | focused style mixin | `{}`


@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import { IronControlState } from '@polymer/iron-behaviors/iron-control-state.js';
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/iron-selector/iron-selector.js';
import { PaperInputBehavior } from '@polymer/paper-input/paper-input-behavior.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-styles/default-theme.js';
import '@polymer/paper-styles/typography.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: html`
    <style>
      :host {
        @apply --paper-font-common-base;
        --paper-input-container-label: {
          z-index: -1;
        };

        --paper-input-container-underline: {
          z-index: -1;
        };

        --paper-input-container-shared-input-style: {
          position: relative; /* to make a stacking context */
          outline: none;
          box-shadow: none;
          padding: 0;
          width: 100%;
          max-width: 100%;
          background: transparent;
          border: none;
          color: var(--paper-input-container-input-color, var(--primary-text-color));
          -webkit-appearance: none;
          text-align: inherit;
          vertical-align: bottom;

          @apply --paper-font-subhead;
        };

        display: block;
      }
      input {
        @apply --paper-input-container-shared-input-style;
      }
      input::-webkit-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input::-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-ms-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      paper-material {
        border-radius: 0 0 2px 2px;
        width: 100%;
        margin-top: 2px;
        position: absolute;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        max-height: var(--paper-typeahead-results-layer-max-height, auto);
        @apply --paper-typeahead-results;
      }
      .iron-selected:not(paper-input-container) {
        background: var(--paper-typeahead-result-selected-background, var(--paper-indigo-50));
      }
      paper-item[pressed] {
        @apply --paper-typeahead-result-pressed;
      }
      paper-item {
        cursor: pointer;
        position: relative;
        background: #fff;
        @apply --paper-typeahead-result;
        --paper-item-min-height: var(--paper-typeahead-result-min-height, 30px);
        --paper-item-selected-weight: var(--paper-typeahead-selected-weight, normal);
        --paper-item-selected: var(--paper-typeahead-result-selected);
        --paper-item-focused: var(--paper-typeahead-result-focused);
      }
      paper-item:not(:last-of-type) {
        border-bottom: solid 1px var(--paper-typeahead-divider-color, var(--divider-color));
      }
      paper-item:focus:before {
        display: none;
      }
      [hidden] {
        display: none;
      }
    </style>
    <paper-input-container class="selectable" no-label-float="[[noLabelFloat]]" always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]" auto-validate\$="[[autoValidate]]" disabled\$="[[disabled]]" invalid="[[invalid]]">
      <label slot="label" hidden\$="[[!label]]" on-tap="_onLabelTap">[[label]]</label>
      <iron-input slot="input" aria-labelledby\$="[[_ariaLabelledBy]]" aria-describedby\$="[[_ariaDescribedBy]]" bind-value="{{value}}" prevent-invalid-input="[[preventInvalidInput]]" allowed-pattern="[[allowedPattern]]" invalid="{{invalid}}" validator="[[validator]]" on-change="_onChange">
        <input id="input" autocomplete\$="[[autocomplete]]" autocapitalize\$="[[autocapitalize]]" autocorrect\$="on" autofocus\$="[[autofocus]]" disabled\$="[[disabled]]" value="{{typedValue::input}}" inputmode\$="[[inputmode]]" minlength\$="[[minlength]]" maxlength\$="[[maxlength]]" min\$="[[min]]" max\$="[[max]]" required\$="[[required]]" step\$="[[step]]" name\$="[[name]]" placeholder\$="[[placeholder]]" readonly\$="[[readonly]]" size\$="[[size]]" type\$="[[type]]" pattern\$="[[pattern]]">
      </iron-input>
        <paper-material slot="add-on" hidden\$="[[_hideResults]]" elevation="[[elevation]]" on-mousedown="_mouseDownItems" on-mouseleave="_mouseleaveItems" tabindex="-1">
          <iron-selector id="selector" selected="{{selected}}" items="[[selectorItems]]">
            <dom-repeat id="item-list" sort="[[sortFn]]" items="[[filteredItems]]" on-dom-change="_updateItems">
            </dom-repeat>
          </iron-selector>
        </paper-material>
        <paper-input-error slot="add-on" tabindex="-1">[[errorMessage]]</paper-input-error>
    </paper-input-container>

    <template id="defaultTmpl">
      <paper-item on-mouseenter="_mouseenterItem" class="result-item selectable" tabindex="-1">
        <span>[[getDataDisplayValue(item, dataKey)]]</span>
      </paper-item>
    </template>
`,

  is: 'paper-typeahead',

  behaviors: [
    IronA11yKeysBehavior,
    PaperInputBehavior,
    IronControlState,
    IronFormElementBehavior,
    Templatizer,
  ],

  properties: {
    sortFn: {
      type: Function
    },

    arrowsUpdateInput: {
      type: Boolean,
      value: false
    },

    /**
     * Allows a user to show all typeahead results even when there is no input.
     */
    showEmptyResults: {
      type: Boolean,
      value: false
    },

    typedValue: {
      type: String,
      value: '',
      notify: true
    },

    elevation: {
      type: Number,
      value: 1
    },

    keyEventTarget: {
      type: Object,
      value: function() {
        return this;
      }
    },

    typeaheadDisabled: {
      type: Boolean,
      value: false
    },

    /**
     * If defined by a user, function is invoked on every keypress. The result of the function
     * is expected to be a Promise that resolves the a data array.
     * @type {Function<Promise<Array<?>>>|Boolean}
     */
    fetchData: {
      value: false
    },

    data: {
      type: Array,
      value: function() { return []; }
    },

    /**
     * dataKey provides a way to index into your data objects and use a property for display.
     *
     * For instance if you had an array [{color: 'red'}, {color: 'pink'}], you would set the dataKey to 'color'
     * In more complex situations you can do the following, 'color.name' which will extract from {color: {name: 'red'}}.
     */
    dataKey: {
      type: String,
      value: '',
    },

    /**
     * The max number of results to show to pick from when showing selectable items.
     */
    maxResults: {
      type: Number,
      value: 10
    },

    filteredItems: {
      type: Array,
      notify: true,
      value: [],
    },

    filterFn: {
      type: Function,
      value: function() {
        return function(data, value, dataKey) {
          var r = RegExp(value, 'i');

          if (value === '') {
            return this.showEmptyResults ? data : [];
          }

          return data.filter(v => {
            const normalizedData = this._getDataItemValue(v, dataKey);
            return (r.test(normalizedData) ? normalizedData : null);
          });
        };
      }
    },

    selectorItems: {
      type: Array
    },

    // private because we don't want the user to
    // set it true if there is no results
    _hideResults: {
      type: Boolean,
      value: true
    },
  },

  keyBindings: {
    'up': '_upPressed',
    'down': '_downPressed',
    'esc': 'closeResults',
    'enter': '_enterPressed'
  },

  listeners: {
    'iron-activate': '_itemPressed',
    'focus': '_onFocus',
    'blur': '_onBlur',
  },

  observers: [
    '_calculateFilteredData(data.*, typedValue, filterFn, maxResults,' +
    'typeaheadDisabled, dataKey, fetchData)',
  ],

  attached: function() {
    if (!this.ctor) {
      const tmpl = this.queryEffectiveChildren('template') || this.$.defaultTmpl;
      const items = this.$['item-list'];
      items.appendChild(tmpl);
    }
  },

  /**
   * @private
   * @param {Event} e
   */
  _itemPressed: function(e) {
    this.selectResult(e.detail.selected);
  },

  /**
   * @private
   * @param {Event} e
   */
  _upPressed: function(e) {
    e.preventDefault();

    if (!this._hideResults) {
      this.$.selector.selectPrevious();
      this.value = this.selected && this.arrowsUpdateInput ?
        this.filteredItems[this.selected] : this.typedValue;
    }
  },

  /**
   * @private
   * @param {Event} e
   */
  _downPressed: function(e) {
    e.preventDefault();

    if (!this._hideResults) {
      this.$.selector.selectNext();
      this.value = this.selected && this.arrowsUpdateInput ?
        this.filteredItems[this.selected] : this.typedValue;
      // if there are results and they are hide
    } else if (this.filteredItems.length) {
      // show them and select the first one
      this._hideResults = false;
      this.selected = 0;
    }
  },

  /**
   * @private
   */
  _enterPressed: function() {
    return this.selectResult(this.selected);
  },

  /**
   * @private
   */
  _mouseenterItem: function(e) {
    this.selected = this.$.selector.indexOf(e.target);
  },

  /**
   * @private
   */
  _mouseleaveItems: function() {
    this.selected = 0;
  },

  /**
   * @private
   * @param {{base: Array<?>}} data
   * @param {string} typedValue
   * @param {Function<Array>} filterFn
   * @param {number} maxResults
   * @param {boolean} typeaheadDisabled
   * @param {string} dataKey
   * @param {Function<Promise<Array<?>>>|Boolean} fetchData
   */
  _calculateFilteredData: function(
    data,
    typedValue,
    filterFn,
    maxResults,
    typeaheadDisabled,
    dataKey,
    fetchData
  ) {
    Promise.resolve().then(() => {
      if (typeaheadDisabled) {
        return [];
      }

      if (typeof fetchData === 'function') {
        let fetcher = /** @type{Function<Promise<Array<?>>>} */ (
            this.fetchData);

        return fetcher(typedValue);
      }

      return data.base;
    }).then(results => {
      const filteredItems = filterFn.call(
        this, results, typedValue, dataKey).slice(0, maxResults);

      this.set('filteredItems', filteredItems);
      this.set('_hideResults', !this._canShowResults(filteredItems));
    });
  },

  /**
   * @private
   * @param {!Array<?>} results
   * @return {boolean}
   */
  _canShowResults: function(results) {
    let elmActive = (document.activeElement === this.$.input ||
        this.root.activeElement === this.$.input);

    return elmActive && results && results.length > 0;
  },

  _updateItems: function() {
    this.selectorItems = Array.from(
        dom(this.root).querySelectorAll('.selectable'));
    this.selected = 0;
  },

  /**
   * Select a Result in the filteredItems array by index then
   * close the results.
   *
   * @param {!number} itemIndex The index of the item to select
   */
  selectResult: function(itemIndex) {
    // Since the results can be sorted we need to normalize here.
    var targetResult = this.filteredItems.sort(
        this.sortFn || function() {})[itemIndex];

    if (targetResult === undefined) {
      this.fire('customvalentered', {target: this.typedValue});
    } else {
      this.value = this._getDataItemValue(
        targetResult, this.dataKey);
      this.fire('selected', {target: this.value, targetResult: targetResult});
      this.closeResults();
    }
  },

  /**
   * Manually display the results if the filteredItems array is not empty.
   *
   * @return {boolean} True if the results are displayed.
   */
  tryDisplayResults: function() {
    var items = this.filteredItems;

    if (this._hideResults && this._canShowResults(items)) {
      this.set('_hideResults', false);
    }

    return !this._hideResults;
  },

  getDataDisplayValue: function(data, dataKey) {
    return this._getDataItemValue(data, dataKey);
  },

  /**
   * Manually hide the results and reset selected item.
   */
  closeResults: function() {
    this._hideResults = true;
    this.selected = 0;
  },

  /**
   * Stop the _onBlur event from firing when scrollbar is clicked.
   *
   * @param {!Event} e
   */
  _mouseDownItems: function(e) {
    e.preventDefault();
  },

  /**
   * @private
   */
  _onFocus: function() {
    this.tryDisplayResults();
  },

  /**
   * @private
   */
  _onBlur: function() {
    this.closeResults();
  },

  /**
   * @private
   */
  _onLabelTap: function() {
    this.$.input.focus();
  },

  /**
   * @private
   * @param {!string|!Object} data
   * @param {!string} dataKey
   */
  _getDataItemValue: function(data, dataKey) {
    if (this.dataKey === '') {
      return data;
    }

    const splitKey = this.dataKey.split('.');

    if (splitKey.length === 1) {
      return /** @type {!Object} */ (data)[dataKey];
    }

    return splitKey.slice(1).reduce((prev, curr) => {
      return /** @type {!Object} */ (prev)[curr];
    }, data[splitKey[0]]);
  }
});
