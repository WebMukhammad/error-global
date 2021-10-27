# Модуль для базовых ошибок

## Скачать

- Добавьте зависимость `google-optimize-module` в ваш проект с помощью yarn или npm
```sh
yarn add google-optimize-module
```
ИЛИ
```sh
npm install google-optimize-module --save
```

- Добавьте `google-optimize-module` в `modules` в файле `nuxt.config.js`

```js
{
  modules: [
    // Опциональные настройки
    ['google-optimize-module', {
        // Активировать ли логирование ошибки в консоли
        logBaseError: true,
        // Активировать ли сентри для отправки ошибки
        errorToSentry: true,
        // Отступы для тултипа в мобильной версии
        mobileOffsetTooltip: true,
        // Хук при инициалиазации проекта
        onInit: (context) => {},
        // Хук при ошибке в классе BaseError
        onBaseError: (context) => {},
        // Хук при ошибке в классе PageError
        onPageError: (context) => {},
        // Хук при ошибке в классе SimpleError
        onSimpleError: (context) => {},
    }]
  ]
}
```