<template>
  <div class="reset-password-container">
    <md-card class="reset-card">
      <md-card-header>
        <div class="md-title">Reset Password confirm</div>
      </md-card-header>

      <md-card-content>
        <form @submit.prevent="handleResetPassword" novalidate>
          <md-field :class="{ 'md-invalid': passwordError }">
            <label>New Password</label>
            <md-input
                v-model="form.password"
                type="password"
                required
                @input="validatePassword"
            ></md-input>
            <span class="md-error" v-if="passwordError">{{ passwordError }}</span>
          </md-field>

          <md-field :class="{ 'md-invalid': confirmPasswordError }">
            <label>Confirm Password</label>
            <md-input
                v-model="form.confirmPassword"
                type="password"
                required
                @input="validateConfirmPassword"
            ></md-input>
            <span class="md-error" v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
          </md-field>

          <div class="form-actions">
            <md-button
                type="submit"
                class="md-primary md-raised"
                :disabled="!isFormValid || isLoading"
            >
              {{ isLoading ? 'Resetting...' : 'Reset Password' }}
            </md-button>
            <md-button to="/login" class="md-button">Back to Login</md-button>
          </div>
        </form>
      </md-card-content>
    </md-card>

    <!-- Success Dialog -->
    <md-dialog :md-active.sync="showSuccessDialog">
      <md-dialog-title>Success</md-dialog-title>
      <md-dialog-content>
        Your password has been successfully reset.
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="goToLogin">Go to Login</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Error Dialog -->
    <md-dialog :md-active.sync="showErrorDialog">
      <md-dialog-title>Error</md-dialog-title>
      <md-dialog-content>
        {{ errorMessage }}
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showErrorDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import UsersService from '@/services/users.service'

export default {
  name: 'ResetPassword',

  data() {
    return {
      form: {
        password: '',
        confirmPassword: ''
      },
      token: '',
      passwordError: null,
      confirmPasswordError: null,
      isLoading: false,
      showSuccessDialog: false,
      showErrorDialog: false,
      errorMessage: ''
    }
  },

  computed: {
    isFormValid() {
      return !this.passwordError &&
          !this.confirmPasswordError &&
          this.form.password &&
          this.form.confirmPassword;
    }
  },

  methods: {
    validatePassword() {
      if (!this.form.password) {
        this.passwordError = 'Password is required';
      } else if (this.form.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters';
      } else if (!/\d/.test(this.form.password)) {
        this.passwordError = 'Password must contain at least one number';
      } else {
        this.passwordError = null;
      }
      this.validateConfirmPassword();
    },

    validateConfirmPassword() {
      if (!this.form.confirmPassword) {
        this.confirmPasswordError = 'Please confirm your password';
      } else if (this.form.password !== this.form.confirmPassword) {
        this.confirmPasswordError = 'Passwords do not match';
      } else {
        this.confirmPasswordError = null;
      }
    },

    async handleResetPassword() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      try {
        await UsersService.resetPassword(this.form.password, this.token);
        this.showSuccessDialog = true;
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred while resetting your password';
        this.showErrorDialog = true;
      } finally {
        this.isLoading = false;
      }
    },

    goToLogin() {
      this.showSuccessDialog = false;
      this.$router.push('/login');
    }
  },

  created() {
    // Get token from URL
    this.token = this.$route.query.token;

    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token';
      this.showErrorDialog = true;
      setTimeout(() => {
        this.$router.push('/login');
      }, 3000);
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.reset-card {
  max-width: 400px;
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.md-field {
  margin-bottom: 16px;

  &.md-invalid {
    margin-bottom: 24px;
  }
}
</style>