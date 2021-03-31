const getBabelConfig = () => ({
    loader: require.resolve('babel-loader'),
    options: {
        babelrc: false,
        presets: [['@babel/preset-env', {'modules': false}], '@babel/preset-react'],
        cacheDirectory: true,
        sourceMap: true,
        plugins: [
            ['babel-plugin-react-css-modules', {
                'filetypes': {
                    '.scss': {
                        syntax: 'postcss-scss',
                        plugins: [
                            ['postcss-nested', {
                                preserveEmpty: true
                            }]
                        ]
                    }
                },
                generateScopedName: "[name]__[local]"
            }],
        ]
    }
});

module.exports = {
    getBabelConfig
}
