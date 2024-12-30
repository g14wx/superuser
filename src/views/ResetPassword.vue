<template>
  <div class="reset-password">
    <md-card class="reset-card">
      <md-card-header>
        <div class="md-title">{{ $t('resetPassword.title') }}</div>
      </md-card-header>

      <md-card-content>
        <form @submit.prevent="handleReset">
          <md-field>
            <label>{{ $t('resetPassword.email') }}</label>
            <md-input v-model="email" type="email" required />
          </md-field>

          <div class="form-actions">
            <md-button type="submit" class="md-primary md-raised" :disabled="loading">
              {{ $t('resetPassword.submit') }}
            </md-button>
            <md-button to="/login" class="md-text">
              {{ $t('resetPassword.backToLogin') }}
            </md-button>
          </div>
        </form>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import AuthService from '@/services/auth.service'

export default {
  name: 'ResetPassword',
  data() {
    return {
      email: '',
      loading: false
    }
  },
  methods: {
    async handleReset() {
      try {
        this.loading = true
        await AuthService.resetPassword(this.email)
        this.$root.$emit('show-success', this.$t('resetPassword.success'))
        this.$router.push('/login')
      } catch (error) {
        this.$root.$emit('show-error', error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>