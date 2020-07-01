import Vue from 'vue'
import Router from 'vue-router'

import Forecast from '@/views/Forecast.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Forecast',
      component: Forecast
    }
  ]
})
