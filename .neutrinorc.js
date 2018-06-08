const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = neutrino => {
  const env = process.env.NODE_ENV;
  const pkg = neutrino.options.packageJson;

  /**
   * Only playgrounds are with pkg.private: true
   */
  if (pkg.private) {
    neutrino.use(['@neutrinojs/react', { html: { title: pkg.description } }]);
    
    if (env === 'development') {
      neutrino.config.devServer.port(pkg.devServer.port);
      console.log(`Running on http://localhost:${pkg.devServer.port}`);
    }
  } else {
    /**
     * !REQUIRED!: key `variable` in package's `package.json`
     */
    neutrino.use(['@neutrinojs/library', { name: pkg.variable }]);

    /**
     * It solves monorepo issue with parent node_modules
     * related issues:
     * - https://github.com/liady/webpack-node-externals/issues/39
     * - https://github.com/mozilla-neutrino/neutrino-dev/issues/921
     *
     * (without this it bundles external modules in production)
     */
    neutrino.config.externals([
      nodeExternals({
        modulesDir: path.resolve(__dirname, 'node_modules')
      })
    ]);
  }
};
