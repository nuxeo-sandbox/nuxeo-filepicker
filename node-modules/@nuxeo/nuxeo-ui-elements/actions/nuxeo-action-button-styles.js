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
/*
  Styles module to be used by action elements.

  Custom property | Description | Default
  ----------------|-------------|----------
  `--nuxeo-action-button` | Mixin applied to the action element | { display: inline-block; }
  `--nuxeo-action-button-label` | Mixin applied to action label | {}
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

const $_documentContainer = document.createElement('template'); // eslint-disable-line camelcase

$_documentContainer.innerHTML = `<dom-module id="nuxeo-action-button-styles">
  <template>
    <style>
      :host {
        display: inline-block;
      }

      .label {
        @apply --nuxeo-action-button-label;
      }

      .action {
        @apply --layout-horizontal;
        @apply --layout-center;
        cursor: pointer;
        @apply --nuxeo-action-button;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
