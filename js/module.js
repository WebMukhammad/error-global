import path from 'path'

export default function errorGlobal(options) {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      logBaseError: true,
      errorToSentry: true,
      onInit: (data) => {},
      onBaseError: (data) => {},
      onPageError: (data) => {},
      onSimpleError: (data) => {},
      ...options
    }
  })
}
