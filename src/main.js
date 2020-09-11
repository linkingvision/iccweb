import 'core-js/stable'
import Vue from 'vue'
import CoreuiVue from '@coreui/vue/src'
import App from './App'
import router from './router/index'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import VueI18n from 'vue-i18n'
import LangEn from '../static/lang/en'
import LangZhCHS from '../static/lang/zhchs'
import LangZhCHT from '../static/lang/zhcht'
import './assets/icon/iconfont.css'//字体
import $ from 'jquery'

import axios from '@/http';
Vue.prototype.$http = axios;

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


//注册到vue原型上
import clipboard from 'clipboard';
Vue.prototype.clipboard = clipboard;

Vue.use(CoreuiVue)
Vue.use(VueI18n)
const bus = new Vue()
const i18n = new VueI18n({
  locale:"zhchs",
  messages: {
    'en': LangEn,
    'zhchs': LangZhCHS,
    'zhcht': LangZhCHT
  }
})
i18n.locale = store.state.lang

router.beforeEach((to, from, next) => {
    const type = to.meta.type
    // 判断该路由是否需要登录权限
    if (type === 'Administrator'||type === 'Operator') {
      if (store.state.token) {
		// console.log(type,"2");
		if(store.state.root==='Operator'&&type === 'Operator'){
			next('/dashboard')
		}else{
			next()  // 确保一定要有next()被调用
		}
      } else {
        sessionStorage.removeItem('mcutoken')
        store.state.token = null
        sessionStorage.removeItem('mcuuser')
        store.state.user = null
        sessionStorage.removeItem('mcuroot')
        store.state.root = null
        next('/login')
      }
    } else {
		next()
    }
})


new Vue({
  el: '#app',
  router,
  store,
  i18n,
  icons,
  template: '<App/>',
  components: {
    App
  },
  data: {
    bus
  }
})
