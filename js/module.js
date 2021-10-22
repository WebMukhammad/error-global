import path from 'path'

export default function errorGlobal (options) {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options
  })
}