const path = require('path');
const autoprefixer = require('autoprefixer');
const paths = require('./paths');

const getStyleLoadingConfig = (enableModules) => [
    {
        loader: require.resolve('css-loader'),
        options: {
            importLoaders: 1,
            modules: enableModules,
            localIdentName: "[name]__[local]",
        },
    },
    {
        loader: require.resolve('postcss-loader'),
        options: {
            ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                    browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                }),
            ],
        },
    },
    {
        loader: require.resolve('sass-loader'),
    }
];

module.exports = {
    getStyleLoadingConfig
};
