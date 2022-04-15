const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    devServer: {
        disableHostCheck: true,
    },
    productionSourceMap: false,
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title= ''
            return args
        }),
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin),
            config.plugin('prefetch').tap(options => {
                options[0].fileBlacklist = options[0].fileBlacklist || []
                options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
                return options
            })


    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 开启分离js
            config.optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 20000,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                // npm package names are URL-safe, but some servers don't like @ symbols
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                }
            };
        }
    }

}
