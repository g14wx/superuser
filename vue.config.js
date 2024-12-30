module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `
          @use '@/themes/_variables.scss' as *;
          @use '@/themes/_mixins.scss' as *;
        `
            }
        }
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    },
    configureWebpack: {
        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 250000
            }
        }
    },
    devServer: {
        port: 8083,
        host: '0.0.0.0',
        hot: true,
        watchOptions: {
            poll: true, // Enable polling
            ignored: /node_modules/,
            aggregateTimeout: 300 // Delay before rebuilding
        },
        public: '0.0.0.0:8083',
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
}