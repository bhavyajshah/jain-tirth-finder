// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Add resolution for .web.jsx files for web platform
const { resolver } = config;
resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json', 'cjs');
resolver.assetExts = resolver.assetExts.filter((ext) => !ext.includes('svg'));
resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'jpeg');

module.exports = config;