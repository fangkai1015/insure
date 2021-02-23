// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueClipboard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/main.css'
import { Select, Option, Input, Dialog, Button, Form, FormItem, Radio, DatePicker, Pagination, Checkbox, Message, Loading, MessageBox } from 'element-ui';
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(VueClipboard)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm

axios.defaults.withCredentials = true;
Vue.prototype.$ajax = axios;
Vue.config.productionTip = false;
const ENV = process.env.NODE_ENV;
if(ENV === 'development') {
  axios.defaults.baseURL = '/api'
}else if(ENV === 'production') {
  axios.defaults.baseURL = ''
}
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.code == 9) {
      localStorage.removeItem('user');
      let host = window.location.host,protocol = window.location.protocol;
      window.location.href = protocol +'//'+ host + '/#/login';
    }
    return response;
},
error => {
if(error.response) {
  switch(error.response.status) {
    case 401:
      localStorage.removeItem('user');
      let host = window.location.host,protocol = window.location.protocol;
      window.location.href = protocol +'//'+ host + '/#/login';
  }
}
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
