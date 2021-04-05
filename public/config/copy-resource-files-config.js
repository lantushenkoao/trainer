const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');

const getCopyResourcesPluginConfig = () =>
    new CopyWebpackPlugin([
        {
            from: path.join(paths.appNodeModules, '@epicfaace/mxgraph/javascript/src'),
            to: path.join(paths.appBuild, 'mxgraph')
        },
        {
            from: path.join(paths.appPublic,'manifest.json'),
            to: path.join(paths.appBuild,'manifest.json')
        },
        {
            from: path.join(paths.appPublic,'favicon.ico'),
            to: path.join(paths.appBuild,'favicon.ico')
        }
    ]);

module.exports = {getCopyResourcesPluginConfig};
