const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

config.transformer.inlineRequires = true;
config.transformer.minifierConfig = {
  inlineRem: 16,
};
 
module.exports = withNativeWind(config, { input: './app/global.css', inlineRem: 16 })