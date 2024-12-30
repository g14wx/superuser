<template>
  <div class="theme-switcher">
    <md-switch
        v-model="isDark"
        class="md-primary"
        @change="toggleTheme"
    >
      {{ $t(`settings.${isDark ? 'darkMode' : 'lightMode'}`) }}
    </md-switch>
  </div>
</template>

<script>
export default {
  name: 'ThemeSwitcher',

  data() {
    return {
      isDark: false
    }
  },

  methods: {
    toggleTheme() {
      document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light')
      document.body.className = this.isDark ? 'theme-dark' : 'theme-light'
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem('theme') || 'light'
      this.isDark = savedTheme === 'dark'
      this.toggleTheme()
    }
  },

  mounted() {
    this.initializeTheme()
  }
}
</script>

<style lang="scss" scoped>
.theme-switcher {
  margin: 0 16px;
}
</style>