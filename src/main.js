require('./bootstrap')
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
// import vbclass from 'vue-body-class'

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next()
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } if (to.matched.some(record => record.meta.requiresGuest)) {
    if (store.getters.isLoggedIn) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
if (store.getters.isLoggedIn) {
  store.dispatch('saveTokens', {tokens: store.getters.accessTokens, isLocalLogin: true})
}
// Vue.use(vbclass, router)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
