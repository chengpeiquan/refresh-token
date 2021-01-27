import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


/** 
 * 引入插件
 */
import { Button, Form, Input, Divider } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'


/** 
 * 引入全局样式
 */
import '@styl/normalize.styl'
import '@styl/global.styl'


/** 
 * 引入本地库
 */
import '@libs/mock'


/** 
 * 初始化项目
 */
createApp(App)
  .use(router)
  .use(Button)
  .use(Form)
  .use(Input)
  .use(Divider)
  .mount('#app')
