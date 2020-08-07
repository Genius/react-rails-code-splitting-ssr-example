import React from 'react';
import ReactRailsUJS from 'react_ujs';
import ReactDOMServer from 'react-dom/server';
import {ChunkExtractor} from '@loadable/server';

const componentRequireContext = require.context('entry', false);
ReactRailsUJS.useContext(componentRequireContext);

ReactRailsUJS.serverRender = function(renderFunction, componentName, props, manifest) {
  const ComponentConstructor = this.getConstructor(componentName);

  const app = (
    <ComponentConstructor {...props} />
  );

  const extractor = new ChunkExtractor({stats: manifest, entrypoints: ['application']});
  const wrapper = extractor.collectChunks(app);

  const html = ReactDOMServer[renderFunction](wrapper);
  const scriptTags = extractor.getScriptTags();
  const linkTags = extractor.getLinkTags();

  const headTags = [scriptTags, linkTags].join('');

  return {
    html,
    headTags,
  };
};
