const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add 'obj' to the list of asset extensions
defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  'obj',
];

module.exports = defaultConfig;