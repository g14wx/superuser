<template>
  <div class="login-container">
    <md-card class="login-card">
      <md-card-header>
        <div class="md-title">{{ $t('login.title') }}</div>
      </md-card-header>

      <md-card-content>
        <form @submit.prevent="handleLogin">
          <md-field>
            <label>{{ $t('login.email') }}</label>
            <md-input v-model="form.email" type="email" required />
          </md-field>

          <md-field>
            <label>{{ $t('login.password') }}</label>
            <md-input v-model="form.password" type="password" required />
          </md-field>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="actions">
            <md-button type="submit" class="md-primary md-raised" :disabled="loading">
              {{ $t('login.submit') }}
            </md-button>
            <md-button to="/reset-password" class="md-button">
              {{ $t('login.forgotPassword') }}
            </md-button>
          </div>
        </form>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Login',

  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },

  computed: {
    ...mapState('auth', ['loading', 'error'])
  },

  methods: {
    async handleLogin() {
      try {
        await this.$store.dispatch('auth/login', this.form)
        // After successful login, redirect to the intended destination or dashboard
        const redirectPath = this.$route.query.redirect || '/dashboard'
        this.$router.push(redirectPath)
      } catch (error) {
        // Error is handled by the store
        console.error('Login failed:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  max-width: 400px;
  width: 100%;
}

.error-message {
  color: var(--md-theme-default-error-on-background, #ff1744);
  margin-bottom: 16px;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}
</style>