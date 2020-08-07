const path = require('path');
const {Environment, config} = require('@rails/webpacker');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const LoadablePlugin = require('@loadable/webpack-plugin');

/**
 * For code splitting and SSR to work together, we need to compile
 * our client and server entry points with slightly different configurations.
 * This is made possible by setting webpacker.yml's source_entry_path to
 * a nonexistent directory, resulting in there being no default entry points.
 */
const server = new Environment();
const client = new Environment();
server.entry.set('server_rendering', path.resolve(path.join(config.source_path, 'packs/server_rendering.js')));
client.entry.set('application', path.resolve(path.join(config.source_path, 'packs/application.js')));

/**
 * Webpacker assumes that it'll output a single manifest.json file,
 * so we need to merge the stats manifests from both compilers
 * https://github.com/webdeveric/webpack-assets-manifest/issues/48#issuecomment-470443650
 */
const webpackAssetsManifestPluginOptions = Object.assign({}, server.plugins.get('Manifest').options);
const sharedManifestDataStore = Object.create(null);
webpackAssetsManifestPluginOptions.assets = sharedManifestDataStore;
const sharedWebpackAssetsManifestPlugin = new WebpackAssetsManifest(webpackAssetsManifestPluginOptions);
const oldSetRaw = sharedWebpackAssetsManifestPlugin.setRaw;
sharedWebpackAssetsManifestPlugin.setRaw = function(key, value) {
  const self = sharedWebpackAssetsManifestPlugin;
  const entrypointsKey = self.options.entrypointsKey;
  if (key === entrypointsKey && typeof entrypointsKey === 'string') {
    const existing_entrypoints = self.get(entrypointsKey);

    if (typeof existing_entrypoints === 'object' && existing_entrypoints != null) {
      const merged_entrypoints = Object.assign({}, existing_entrypoints || {}, value);
      oldSetRaw.call(self, key, merged_entrypoints);
      return;
    }
  }

  oldSetRaw.call(self, key, value);
};

/**
 * Shared custom config
 */
[server, client].forEach((environment) => {
  environment.plugins.append('Manifest', sharedWebpackAssetsManifestPlugin);

  environment.config.set('target', 'web');

  /**
   * Overrides use of `window` in SSR
   */
  environment.config.set(
    'output.globalObject',
    "(typeof self !== 'undefined' ? self : this)"
  );
});

/**
 * Track loadable-components stats separately so they don't overwrite each other
 */
server.plugins.prepend('Loadable', new LoadablePlugin({filename: 'server-loadable-stats.json'}));
client.plugins.prepend('Loadable', new LoadablePlugin({filename: 'client-loadable-stats.json'}));

/**
 * We need to somehow tell the babel config to enable babel-plugin-dynamic-import-node
 * just for this bundle, even though the webpack target is technically "web"
 * https://github.com/babel/babel-loader/blob/master/src/injectCaller.js#L24
 */
const babelLoader = server.loaders.get('babel');
server.loaders.append('babel', Object.assign({}, babelLoader, {
  use: [
    {
      loader: 'babel-loader',
      options: {
        caller: {
          execJS: true,
        },
      },
    },
  ],
}));

/**
 * Split chunks for the client bundle only!
 * ExecJS can't handle split chunks
 */
client.splitChunks(c => Object.assign({}, c, {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
        },
      },
    },
  },
}));

module.exports = [
  server,
  client,
];
