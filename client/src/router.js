import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Login from './components/Login.vue'
import Admin from './components/Admin/Admin.vue'
import RegisterAdmin from './components/RegisterAdmin.vue'
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
      path: '/register-admin',
      name: 'register-admin',
      component: RegisterAdmin,
      meta: { initialSetup: true }
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  var auth = router.app.$auth

  if (to.meta.requiresAdmin && !auth.isAdmin()) {
    next({
      name: auth.isAuth ? 'index' : 'login'
    })
  } else if (to.meta.initialSetup) {
    const { count } = await router.app.$http('get', '/api/user/count')

    next({
      name: count > 0 ? 'index' : null
    })
  } else if (to.meta.requiresAuth && !auth.isAuth) {
    next({
      name: 'login'
    })
  } else if (to.name === 'login' && auth.isAuth) {
    next({
      name: 'index'
    })
  } else if (!to.meta.requiresAdmin && auth.isAdmin()) {
    next({
      name: 'admin'
    })
  } else {
    next()
  }
})

export default router
