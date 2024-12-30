module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `
          @import "@/themes/_variables.scss";
          @import "@/themes/_mixins.scss";
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
        port: 3030,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}