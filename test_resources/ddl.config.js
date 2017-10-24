require("babel-register");
require("babel-polyfill");

const webpack = require('webpack')

const SRC_PATH = __dirname + '/frontend/src/metabase'
const BUILD_PATH = __dirname + '/resources/frontend_client'

const vendors = [
    "babel-polyfill",
    "classnames",
    "crossfilter",
    "cxs",
    "d3",
    "dc",
    "diff",
    "history",
    "humanize-plus",
    "icepick",
    "iframe-resizer",
    "inflection",
    "isomorphic-fetch",
    "moment",
    "normalizr",
    "number-to-locale-string",
    "password-generator",
    "prop-types",
    "react",
    "react-addons-css-transition-group",
    "react-addons-perf",
    "react-addons-shallow-compare",
    "react-ansi-style",
    "react-collapse",
    "react-copy-to-clipboard",
    "react-dom",
    "react-draggable",
    "react-height",
    "react-motion",
    "react-redux",
    "react-resizable",
    "react-retina-image",
    "react-router",
    "react-router-redux",
    "react-sortable",
    "react-textarea-autosize",
    "react-virtualized",
    "recompose",
    "redux",
    "redux-actions",
    "redux-auth-wrapper",
    "redux-form",
    "redux-logger",
    "redux-promise",
    "redux-router",
    "redux-thunk",
    "reselect",
    "resize-observer-polyfill",
    "screenfull",
    "simple-statistics",
    "stack-source-map",
    "tether",
    "underscore",
    "wd-react-intl-universal",
]

module.exports = {
  output: {
    path: BUILD_PATH + '/app/dist',
    filename: '[name].dll.js',
    library: '[name]_dll',
  },
  entry: {
    vendors: vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]_dll',
      context: __dirname,
    }),
  ],
};