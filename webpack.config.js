const {DefinePlugin, ProvidePlugin} = require('webpack')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const DotEnv = require('dotenv')

const config = {
    entry: [
        'react-hot-loader/patch',
        './src/index.tsx',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        filename: '[name].[contenthash].js',
    },
    optimization: {
        emitOnErrors: true,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    plugins: [
        new ProvidePlugin({
            process: 'process/browser',
        }),
        new CopyPlugin({
            patterns: [
                {from: 'src/index.tsx'},
            ],
        }),
        new HtmlWebpackPlugin({
            templateContent: ({htmlWebpackPlugin}) => `<!DOCTYPE html><html lang="en"><head><meta charset=\"utf-8\"><title>${htmlWebpackPlugin.options.title}</title></head><body><div id="app"></div></body></html>`,
            filename: 'index.html',
            title: 'Mango Exercise',
        }),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),

        new StylelintPlugin({
            configFile: '.stylelintrc.json',
            exclude: [
                'node_modules',
            ],
            fix: false,
        }),

    ],
    devServer: {
        server: {
            type: 'https',
        },
        allowedHosts: 'all',
        historyApiFallback: {
            disableDotRule: true,
        },
        'static': {
            directory: './dist',
        },
        compress: true,
        port: 50000,
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
        ],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
}

module.exports = (_env, argv) => {
    const dotEnv = DotEnv.config({path: `./.env.${argv.mode === 'development' ? 'dev' : 'prod'}`})

    config.plugins.push(
        new DefinePlugin({
            'process.env': JSON.stringify(dotEnv.parsed),
        }),
    )
    if (argv.hot) {
        config.output.filename = '[name].[hash].js'
    }

    return config
}
