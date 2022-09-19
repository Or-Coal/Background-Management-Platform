import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// import './plugins/element.js'
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
// import { prototype }  from 'core-js/core/dict'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//配置请求根路径
import TreeTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'
axios.defaults.baseURL='http://heshicheng.cn:8888/api/private/v1/'
//在request拦截器中，展示进度条NProgress.start()
NProgress.start()
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//在response拦截器中，隐藏进度条NProgress.done()
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.filter('dataFormat',function(originVal){
const dt=new Date(originVal)
const y = dt.getFullYear()
const m =(dt.getMonth() + 1+'').padStart(2,'0')
const d = (dt.getDate()+'').padStart(2,'0')
const hh = (dt.getHours()+'').padStart(2,'0')
const mm = (dt.getMinutes()+'').padStart(2,'0')
const ss = (dt.getSeconds()+'').padStart(2,'0')
return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 将富文本编译器变成全局可用的
Vue.use(VueQuillEditor, /* { default global options } */)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
