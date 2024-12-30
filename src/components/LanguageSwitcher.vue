<template>
  <div class="language-switcher">
    <md-field>
      <md-select
          v-model="currentLocale"
          @input="changeLocale"
          :placeholder="$t('settings.language')"
      >
        <md-option value="en">English</md-option>
        <md-option value="es">Español</md-option>
      </md-select>
    </md-field>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      currentLocale: this.$i18n.locale
    }
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale
      localStorage.setItem('locale', locale)
      document.querySelector('html').setAttribute('lang', locale)
    }
  },
  created() {
    // Initialize locale from localStorage
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale) {
      this.changeLocale(savedLocale)
    }
  }
}
</script>
