module.exports = neutrino => {
  const pkg = neutrino.options.packageJson;
  neutrino.use(["@neutrinojs/react", { html: { title: pkg.description } }]);
};
