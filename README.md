## Nuxeo Filepicker Sample

This is a Nuxeo sample to browse documents and select their renditions

To test it:

(Node: v11.9.0 - NPM: v6.9.0)

- In a local nuxeo server, go to `nxserver/config`, create a file `cors-config.xml` and add the following xml within: 

```
<component name="org.nuxeo.ecm.platform.ui.web.filepicker.cors">
<extension target="org.nuxeo.ecm.platform.web.common.requestcontroller.service.RequestControllerService" point="corsConfig">
    <corsConfig name="foobar" supportedMethods ="GET,POST,HEAD,OPTIONS,DELETE,PUT">
      <pattern>/nuxeo/.*</pattern>
    </corsConfig>
</extension>
</component>
```

- Run a local Nuxeo server (if it's elsewhere, you can change the url in `nuxeo-filepicker.js`)
- Run `npm install` in this repository
- Add the content of `nuxeo-deps.zip/nuxeo-deps` in `node_modules` (replace all files existing already)
- Run `npm run serve` 


-----

List of deps in `node_modules`:

```
@morbidick               buffer                   d3-selection             iconv-lite               md5                      promise-queue
@nuxeo                   charenc                  d3-shape                 ieee754                  mime-db                  querystring
@polymer                 combined-stream          delayed-stream           is-buffer                mime-types               random-js
@vaadin                  cropperjs                encoding                 json-parse-better-errors moment                   safe-buffer
@webcomponents           crypt                    es6-promise              lit-element              node-fetch-npm           safer-buffer
asynckit                 d3-hierarchy             extend                   lit-html                 nuxeo                    whatwg-fetch
base64-js                d3-path                  form-data                marked                   polymer-cli
```
