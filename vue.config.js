const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    //关闭eslint
    lintOnSave: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://47.94.142.244:8080',
                pathRewrite: {'^/api': ''},
                ws: true,
                changeOrigin: true
            },
        },
    },
})
