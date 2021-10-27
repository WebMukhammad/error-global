import path from 'path'

export default function errorGlobal(options) {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      logBaseError: true,
      errorToSentry: true,
      onInit: (context) => {},
      onBaseError: (context) => {},
      onPageError: (context) => {},
      onSimpleError: (context) => {},
      ...options,
      mobileOffsetTooltip: JSON.stringify(options.mobileOffsetTooltip || [])
    }
  })
}