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
        return require('broccoli-babel-transpiler')(tree, {
          filterExtensions: ['jsx'],
          whitelist:        ['react']
        });
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
