import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

Vue.use(VueI18n)

export const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || process.env.VUE_APP_I18N_LOCALE || 'en',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: { en, es }
})