const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

const PATHS = {
    app: path.join(__dirname, 'app/index.js'),
    build: path.join(__dirname, 'dist/')
};
const JS_PUBLIC_URL = "https://huanhulan.github.io/my-flappy-bird/dist/";
const FILE_PUBLIC_URL = 'https://huanhulan.github.io/my-flappy-bird/src/';

const common = {
    entry: PATHS.app,
    output: {
        filename: 'index.js',
        path: PATHS.build,
        publicPath: "/dist/"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }, ],
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify(process.env.NODE_ENV),
            FILE_PUBLIC_URL: JSON.stringify('../src/'),
        })
    ],
};

const developmentConfig = {
    devServer: {
        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,

        // Don't refresh if hot loading fails. If you want
        // refresh behavior, set hot: true instead.
        hotOnly: true,

        // Display only errors to reduce the amount of output.
        stats: 'errors-only',

        // Parse host and port from env to allow customization.
        //
        // If you use Vagrant or Cloud9, set
        // host: options.host || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices
        // unlike default `localhost`.
        host: '0.0.0.0', // Defaults to `localhost`
        port: process.env.PORT, // Defaults to 8080
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
};

module.exports = function(env) {
    if (env.NODE_ENV === 'production') {
        return Object.assign(
            common,
            {
                output: {
                    filename: 'index.js',
                    path: PATHS.build,
                    publicPath: `${JS_PUBLIC_URL}`
                },
                plugins: [
                    new webpack.DefinePlugin({
                        ENV: JSON.stringify(process.env.NODE_ENV),
                        FILE_PUBLIC_URL: JSON.stringify(FILE_PUBLIC_URL),
                    })
                ]
            }
        );
    }

    return Object.assign({},
        common,
        developmentConfig,
        {
            plugins: common.plugins.concat(developmentConfig.plugins),
        }
    );
}