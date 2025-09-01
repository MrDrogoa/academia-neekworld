const { defineConfig } = require('@vue/cli-service')
const { DefinePlugin } = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: config => {
    // Plugins siempre necesarios
    config.plugins.push(
      new DefinePlugin({
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
    )

    // Configuración específica para producción
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        ...config.optimization,
        minimizer: config.optimization.minimizer.filter(
          plugin => plugin.constructor.name !== 'CssMinimizerPlugin'
        )
      }
    }
  },
  css: {
    extract: {
      // Deshabilitar minificación de CSS temporalmente para evitar errores de parser
      ignoreOrder: true
    }
  },
  devServer: {
    client: {
      webSocketURL: 'ws://localhost:8080/ws'
    }
  }
})
