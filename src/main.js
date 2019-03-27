// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import preview from 'vue-photo-preview'
import elementUi from 'element-ui'
import axios from './global/axiosConfig'
import BaiduMap from 'vue-baidu-map'
import global from './global/global'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-photo-preview/dist/skin.css'
import './assets/css/common.css'
import './assets/css/rewriteMint.css'
Vue.config.productionTip = false
Vue.use(elementUi)
Vue.use(preview)
Vue.prototype.$axios = axios.axios
Vue.use(BaiduMap,{
  ak: global.APIKEY
})
Vue.use(axios)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App},
  template: '<App/>'
})
