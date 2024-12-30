import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import { i18n } from './plugins/i18n'

Vue.use(VueMaterial)

Vue.config.productionTip = false

new Vue({
    router,
    store,  // This was missing
    i18n,
    render: h => h(App)
}).$mount('#app')