import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Login from './components/Login.vue'
import Admin from './components/Admin/Admin.vue'
import NotFound from './components/NotFound.vue'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAdmin: true }
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  var auth = router.app.$auth
  if (!auth.isAuth()) {
    auth.auth()
  }

  if (to.meta.requiresAdmin && !auth.isAdmin()) {
    next({
      name: auth.isAuth() ? 'index' : 'login'
    })
  } else if (to.meta.requiresAuth && !auth.isAuth()) {
    next({
      name: 'login'
    })
  } else {
    next()
  }
})

export default router
