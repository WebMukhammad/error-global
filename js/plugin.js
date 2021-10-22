import Vue from 'vue'
import Tooltip from '05-ui-kit/lib/Tooltip'

const options = '<%= options %>'

const { onError, logBaseError } = {
  onError: () => {},
  logBaseError: (e) => {
    console.log('%c' + (e?.loggerTitle || 'Произошла ошибка'), 'font-size:17px;color:red')
    console.log(e)
    if (e?.native) console.log(e.native)
  },
  ...options
}

export default function ({ error }, inject) {

  Vue.config.errorHandler = (e) => {
    new BaseError({ ...ErrorSeriazlier(e), loggerTitle: 'Ошибка в глобальном обработчике вью' })
  }

  if (process.client) {
    window.onunhandledrejection = (e) => {
      new BaseError({ ...ErrorSeriazlier(e), loggerTitle: 'Ошибка в глобальном обработчике window.onunhandledrejection' })
    }
  }
  class BaseError extends Error {
    constructor(arg) {
      super(arg?.message)

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, BaseError)
      }

      this.name = 'BaseError'
      onError(arg)
      logBaseError(arg)
      
      console.log(JSON.stringify('<%= options %>'))
      console.dir(JSON.stringify('<%= options %>'))
      console.dir('<%= options %>')
    }
  }

  class PageError extends BaseError {
    constructor({ type, name, message, code = 500, native } = {}) {
      super({ type, name, message, code, native, loggerTitle: 'Ошибка на странице' })
      this.name = 'PageError'
      error({
        message,
        statusCode: code
      })
    }
  }

  class SimpleError extends BaseError {
    constructor({ type, name = 'Произошла ошибка', message = 'Информация отправлена разработчикам', code, native } = {}) {
      super({ type, name, message, code, native })
      this.name = 'SimpleError'
      if (process.client) {
        Tooltip({
          type: 'error',
          title: name,
          description: message
          // mobileOffset: [5, 5, 63, 5]
        })
      }
    }
  }

  inject('baseError', BaseError)
  inject('pageError', PageError)
  inject('simpleError', SimpleError)
}

function ErrorSeriazlier (event) {
  const api = !!event?.request
  const model = !!event?.isModelError
  const syntax = !model && ['TypeError', 'SyntaxError', 'RangeError', 'InternalError', 'ReferenceError'].some((v) => v === event?.name)
  const type = model ? 'model' : api ? 'api' : syntax ? 'syntax' : 'unknown'

  return {
    type,
    name: event?.name,
    message: event?.message,
    code: event?.response?.status || null,
    native: event
  }
}
