import Vue from 'vue'
import { Model } from 'objectmodel'
import Tooltip from '05-ui-kit/lib/Tooltip'

const logBaseError = <%= options.logBaseError %>
const errorToSentry = <%= options.errorToSentry %>
const onInit = <%= options.onInit %>
const onBaseError = <%= options.onBaseError %>
const onPageError = <%= options.onPageError %>
const onSimpleError = <%= options.onSimpleError %>

export default function (context, inject) {
  
  onInit(context)

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

      onBaseError(arg)
      errorToSentry && this.sendErrorToSentry(arg)
      logBaseError && this.log(arg)
    }

    log(e) {
      console.log('%c' + (e?.loggerTitle || 'Произошла ошибка'), 'font-size:17px;color:red')
      console.log(e)
      if (e?.native) console.log(e.native)
    }

    sendErrorToSentry(e) {
      if (process.env.NODE_ENV === 'production') {
        context.$sentry.captureException(e?.message || 'произошла ошибка')
      }
    }
  }

  class PageError extends BaseError {
    constructor({ type, name, message, code = 500, native } = {}) {
      super({ type, name, message, code, native, loggerTitle: 'Ошибка на странице' })
      this.name = 'PageError'
      context.error({
        message,
        statusCode: code
      })

      onPageError()
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

      onSimpleError()
    }
  }

  inject('baseError', BaseError)
  inject('pageError', PageError)
  inject('simpleError', SimpleError)
}

function ErrorSeriazlier(event) {
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