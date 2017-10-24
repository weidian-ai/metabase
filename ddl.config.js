require("babel-register");
require("babel-polyfill");

const webpack = require('webpack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const allTokens = require("./frontend/src/metabase/lib/expressions/tokens").allTokens;
const chevrotain = require("chevrotain");
const SRC_PATH = __dirname + '/frontend/src/metabase';
const BUILD_PATH = __dirname + '/resources/frontend_client';
const NODE_ENV = process.env["NODE_ENV"] || "development";
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

const config = {
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
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(NODE_ENV)
        }
    })
  ],
};

if (NODE_ENV === 'production') {
  config.plugins.push(new ParallelUglifyPlugin({
        uglifyJS:{
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
            mangle: {
                // this is required to ensure we don't minify Chevrotain token identifiers
                // https://github.com/SAP/chevrotain/tree/master/examples/parser/minification
                except: allTokens.map(function(currTok) {
                    return chevrotain.tokenName(currTok);
                })
            }
        }
    }))
}

module.exports = config