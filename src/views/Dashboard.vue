<template>
  <div class="dashboard">
    <md-card>
      <md-card-header>
        <div class="md-title">{{ $t('dashboard.title') }}</div>
      </md-card-header>

      <md-card-content>
        <div class="dashboard-header">
          <h2>{{ $t('dashboard.welcome', { email: user.email }) }}</h2>
          <div class="dashboard-actions">
            <language-switcher />
            <theme-switcher />
          </div>
        </div>

        <md-tabs>
          <md-tab :label="$t('dashboard.overview')">
            <!-- Add dashboard widgets/content here -->
          </md-tab>
          <md-tab :label="$t('dashboard.statistics')">
            <!-- Add statistics content here -->
          </md-tab>
        </md-tabs>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

export default {
  name: 'Dashboard',
  components: {
    LanguageSwitcher,
    ThemeSwitcher
  },
  computed: {
    ...mapState('auth', ['user'])
  }
}
</script>
