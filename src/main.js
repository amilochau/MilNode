import VuetifyCore from './plugins/vuetify'
import { I18nCore, i18n } from './plugins/i18n'
import { VuexCore, store } from './plugins/vuex'
import { RouterCore, router } from './plugins/router'
import { MilNodeCore, mnOptions } from './plugins/milnode'

import components from './components'

import App from './App'
import { EventBus } from './event-bus'
import Meta from './mixins/meta'

import baseService from './services/base.service'
import crudService from './services/crud.service'
import accountService from './services/account.service'
import applicationService from './services/application.service'

const MilNode = {
  install (Vue, options) {
    // Vuetify
    Vue.use(VuetifyCore, options)

    // I18n
    Vue.use(I18nCore, options)

    // Vuex
    Vue.use(VuexCore, options)

    // Router
    Vue.use(RouterCore, options)

    // MilNode
    Vue.use(MilNodeCore, { components, ...options })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MilNode)
}

export default MilNode
export {
  MilNode,
  App,
  EventBus,
  Meta,
  i18n,
  store,
  router,
  mnOptions,
  applicationService,
  baseService,
  crudService,
  accountService
}
