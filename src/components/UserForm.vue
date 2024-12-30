<template>
  <md-dialog :md-active.sync="showDialog">
    <md-dialog-title>{{ isEdit ? $t('users.edit') : $t('users.addNew') }}</md-dialog-title>

    <md-dialog-content>
      <form @submit.prevent="handleSubmit">
        <md-field>
          <label>{{ $t('users.email') }}</label>
          <md-input v-model="form.email" type="email" required></md-input>
        </md-field>

        <md-field>
          <label>{{ $t('users.role') }}</label>
          <md-select v-model="form.role" required>
            <md-option value="USER">User</md-option>
            <md-option value="ADMIN">Admin</md-option>
            <md-option value="SUPER_ADMIN">Super Admin</md-option>
          </md-select>
        </md-field>

        <md-field v-if="!isEdit">
          <label>{{ $t('users.password') }}</label>
          <md-input v-model="form.password" type="password" required></md-input>
        </md-field>
      </form>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-secondary" @click="closeDialog">
        {{ $t('common.cancel') }}
      </md-button>
      <md-button class="md-primary" @click="handleSubmit" :disabled="loading">
        {{ $t('common.save') }}
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  name: 'UserForm',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        email: '',
        role: 'USER',
        password: ''
      },
      loading: false
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show
      },
      set(value) {
        if (!value) {
          this.$emit('close')
        }
      }
    },
    isEdit() {
      return !!this.user
    }
  },
  watch: {
    user: {
      handler(user) {
        if (user) {
          this.form = { ...user }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    resetForm() {
      this.form = {
        email: '',
        role: 'USER',
        password: ''
      }
    },
    closeDialog() {
      this.$emit('close')
    },
    async handleSubmit() {
      try {
        this.loading = true
        await this.$emit('save', this.form)
        this.closeDialog()
      } catch (error) {
        console.error('Error saving user:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>