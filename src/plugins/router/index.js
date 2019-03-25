import Router from 'vue-router'

import scrollBehavior from './scroll-behavior'
import Routes from './../../data/routes'

import { i18n } from './../i18n'
import { store } from './../vuex'
import accountService from './../../services/account.service'

var router

const RouterCore = {
  install (Vue, options = {}) {
    Vue.use(Router)

    function route (path, name, component, requiresAuth, props, children) {
      const hasChildren = Array.isArray(children)

      return {
        path: path,
        meta: { requiresAuth },
        name: hasChildren ? undefined : name,
        props,
        component: component,
        children: hasChildren
          ? children.map(r => route(
            r.path,
            r.name,
            r.component,
            r.requiresAuth,
            r.props,
            r.children
          ))
          : []
      }
    }

    // options.router.routes
    const routes = [...options.router.routes, ...Routes]
      .filter(r => !options.noBack || !(r.options && r.options.backRequired))
      .filter(r => !options.noAuth || !(r.options && r.options.authRequired))
      .map(r => route(
        r.path,
        r.name,
        r.component,
        r.requiresAuth,
        r.props,
        r.children
      ))

    // options.router.homeComponent
    routes.unshift({
      path: '/',
      name: 'home/Home',
      component: options.router.homeComponent
    })

    // options.router.rootComponent
    // options.router.mode
    router = new Router({
      mode: options.router.mode || 'history',
      scrollBehavior,
      routes: [
        {
          path: '/:lang([a-z]{2})',
          component: options.router.rootComponent,
          props: route => ({ lang: route.params.lang }),
          children: routes
        },
        {
          path: '*',
          redirect: to => {
            let lang = i18n.locale
            return `/${lang}${to.path}`
          }
        }
      ]
    })

    router.beforeEach(async (to, from, next) => {
      // Abort previous loading indicator
      store.dispatch('load/stopLoading')

      if (to.matched.some((record) => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        let logged = await accountService.isLogged()
        if (logged) {
          next()
        } else {
          await accountService.login(to.path)
        }
      } else {
        next() // make sure to always call next()!
      }
    })
  }
}

export default RouterCore
export { RouterCore, router }
