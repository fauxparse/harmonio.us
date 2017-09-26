const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

environment.plugins.set(
  'LoadTimezones',
  new webpack.NormalModuleReplacementPlugin(
    /moment-timezone\/data\/packed\/latest\.json/,
    require.resolve('./timezones')
  )
)

module.exports = environment
