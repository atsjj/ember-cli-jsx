/* jshint node: true */
'use strict';

var checker   = require('ember-cli-version-checker');
var clone     = require('clone');

module.exports = {
  name: 'ember-cli-jsx',

  shouldSetupRegistryInIncluded: function() {
    return !checker.isAbove(this, '0.2.0');
  },

  setupPreprocessorRegistry: function(type, registry) {
    var addon = this;

    registry.add('js', {
      name: 'ember-cli-jsx',
      ext: 'jsx',
      toTree: function(tree) {
        return require('broccoli-babel-transpiler')(tree, getBabelOptions(addon));
      }
    });
  },

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.app = app;

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};

function getAddonOptions(addonContext) {
  var baseOptions = (addonContext.parent && addonContext.parent.options) || (addonContext.app && addonContext.app.options);
  return baseOptions && baseOptions.jsx || {};
}

function getBabelOptions(addonContext) {
  var options = clone(getAddonOptions(addonContext));

  // Ensure modules aren't compiled unless explicitly set to compile
  options.whitelist = options.whitelist || ['react'];

  return options;
}
