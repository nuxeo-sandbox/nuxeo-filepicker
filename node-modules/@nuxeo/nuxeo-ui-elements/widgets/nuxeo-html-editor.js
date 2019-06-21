/**
@license
(C) Copyright Nuxeo Corp. (http://nuxeo.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@nuxeo/nuxeo-elements/nuxeo-element.js';
import './alloy/ckeditor-init.js';
import './alloy/alloy-ocean.js';

{
  /**
   * `nuxeo-html-editor`
   * @memberof Nuxeo
   * @demo demo/nuxeo-html-editor/index.html
   */
  class HTMLEditor extends Nuxeo.Element {
    static get template() {
      return html`
    <style include="alloy-ocean">
      #editor {
        outline: none;
        height: 100%;
        min-height: 30em;
      }

      .ae-placeholder:empty:not(:focus):before {
        color: grey;
        font-style: italic;
      }

      div#editor > * {
        margin-top: 0;
      }
    </style>

    <div id="editor" data-placeholder\$="[[placeholder]]"></div>
`;
    }

    static get is() {
      return 'nuxeo-html-editor';
    }

    static get properties() {
      return {
        element: Object,

        value: {
          type: String,
          notify: true,
          observer: '_valueChanged',
        },

        placeholder: {
          type: String,
          value: 'Type here...',
        },

        readOnly: Boolean,

        hideToolbars: Boolean,
      };
    }

    static get importMeta() {
      return import.meta;
    }

    connectedCallback() {
      super.connectedCallback();
      AlloyEditor._langResourceRequested = true; // skip loading of language file
      const alloyI18Nscript = document.createElement('script');
      alloyI18Nscript.async = true;
      alloyI18Nscript.src = this.resolveUrl(`alloy/lang/alloy-editor/${CKEDITOR.config.language}.js`);
      document.head.appendChild(alloyI18Nscript);
      alloyI18Nscript.onload = () => {
        setTimeout(() => {
          this._init();
        }, 100);
      };
    }

    _init() {
      // init editor
      const toolbars = this.hideToolbars ? {} : {
        add: {
          buttons: ['image', 'camera', 'hline', 'table'],
          tabIndex: 2,
        },
        styles: {
          selections: [
            {
              name: 'link',
              buttons: ['linkEdit'],
              test: AlloyEditor.SelectionTest.link,
            },
            {
              name: 'image',
              buttons: ['imageLeft', 'imageCenter', 'imageRight'],
              test: AlloyEditor.SelectionTest.image,
            },
            {
              name: 'text',
              buttons: ['styles', 'bold', 'italic', 'underline', 'strike', 'paragraphLeft', 'paragraphCenter',
                'paragraphJustify', 'ul', 'ol', 'quote', 'link', 'removeFormat'],
              test: AlloyEditor.SelectionTest.text,
            },
            {
              name: 'table',
              buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
              getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
              setPosition: AlloyEditor.SelectionSetPosition.table,
              test: AlloyEditor.SelectionTest.table,
            },
          ],
          tabIndex: 1,
        },
      };
      const editor = AlloyEditor.editable(this.$.editor, {
        readOnly: this.readOnly,
        uiNode: this.root,
        toolbars,
      });
      this.element = editor.get('nativeEditor');
      // set initial value
      this.element.setData(this.value);

      this.element.on('change', this._updateValue.bind(this));

      this.element.on('actionPerformed', this._updateValue.bind(this));
    }

    _updateValue() {
      this._internalChange = true;
      this.value = this.element.getData();
      this._internalChange = false;
    }

    _valueChanged() {
      if (this.element && !this._internalChange) {
        this.element.setData(this.value);
      }
    }
  }

  customElements.define(HTMLEditor.is, HTMLEditor);
  Nuxeo.HTMLEditor = HTMLEditor;
}
