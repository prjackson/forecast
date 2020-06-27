import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.filter('date', function (value) {
  var parsedTimestamp = new Date(value * 1000)
  return parsedTimestamp.toDateString().split(' ').slice(1, 3).join(' ')
})

Vue.filter('time', function (value) {
  var parsedTimestamp = new Date(value * 1000)
  parsedTimestamp = parsedTimestamp.toLocaleTimeString()
  var secondColIndex = parsedTimestamp.lastIndexOf(':')
  return parsedTimestamp.slice(0, secondColIndex) + parsedTimestamp.slice(secondColIndex + 3)
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
