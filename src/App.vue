<template>
  <div id="app">
    <nav v-if="isAuthenticated">
      <md-toolbar class="md-primary">
        <md-button to="/dashboard">Dashboard</md-button>
        <md-button to="/users">Users</md-button>
        <div class="md-toolbar-section-end">
          <language-switcher />
          <theme-switcher />
          <md-button @click="logout">Logout</md-button>
        </div>
      </md-toolbar>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

export default {
  name: 'App',
  components: {
    LanguageSwitcher,
    ThemeSwitcher
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated'
    })
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.md-toolbar {
  .md-toolbar-section-end {
    display: flex;
    align-items: center;
  }
}
</style>