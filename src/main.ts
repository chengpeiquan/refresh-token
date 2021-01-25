import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@libs/mock'

import "@styl/normalize.styl"
import "@styl/global.styl"

createApp(App)
  .use(router)
  .mount('#app')
