// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require('@rails/ujs').start();
require('@rails/activestorage').start();
require('channels');

// Support component names relative to this directory:
const componentRequireContext = require.context('entry', false);
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRailsUJS = require('react_ujs');
const {loadableReady} = require('@loadable/component');

ReactRailsUJS.removeEvent('DOMContentLoaded', ReactRailsUJS.handleMount);
ReactRailsUJS.useContext(componentRequireContext);

const domIsReady = new Promise((resolve, _reject) => {
  if (document.readyState !== 'loading') {
    resolve(document);
  } else {
    window.addEventListener('DOMContentLoaded', (_event) => {
      resolve(document);
    });
  }
});

domIsReady.then(() => {
  loadableReady(() => {
    const nodes = ReactRailsUJS.findDOMNodes();

    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];
      const className = node.getAttribute(ReactRailsUJS.CLASS_NAME_ATTR);
      const Constructor = ReactRailsUJS.getConstructor(className);
      const propsJson = node.getAttribute(ReactRailsUJS.PROPS_ATTR);
      const props = propsJson && JSON.parse(propsJson);

      const App = (
        <Constructor {...props} />
      );

      // Use instead of hydrate for now to see if it helps the double-rendering problem
      ReactDOM.render(App, node);
    }
  });
});
