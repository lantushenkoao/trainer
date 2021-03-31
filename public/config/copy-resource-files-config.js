const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');

const getCopyResourcesPluginConfig = () =>
    new CopyWebpackPlugin([
        {
            from: path.join(paths.appNodeModules, '@epicfaace/mxgraph/javascript/src'),
            to: path.join(paths.appBuild, 'mxgraph')
        }
    ]);

module.exports = {getCopyResourcesPluginConfig};
