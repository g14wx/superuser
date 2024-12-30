<template>
  <div class="users-container">
    <md-card>
      <md-card-header>
        <div class="md-title">{{ $t('users.title') }}</div>
        <md-button class="md-primary md-raised" @click="showCreateDialog = true">
          <md-icon>add</md-icon>
          {{ $t('users.add') }}
        </md-button>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div v-if="isLoading" class="md-layout-item md-size-100">
            <md-progress-bar md-mode="indeterminate"></md-progress-bar>
          </div>

          <div v-else class="md-layout-item md-size-100">
            <md-table v-model="usersList" md-sort="email">
              <md-table-toolbar>
                <h1 class="md-title">Users</h1>
              </md-table-toolbar>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="Role" md-sort-by="role">{{ item.role }}</md-table-cell>
                <md-table-cell md-label="Actions">
                  <div class="actions-buttons">
                    <md-button @click="editUser(item)" class="md-icon-button md-dense">
                      <md-icon>create</md-icon>
                    </md-button>
                    <md-button @click="confirmDelete(item)" class="md-icon-button md-dense">
                      <md-icon>clear</md-icon>
                    </md-button>
                  </div>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </div>
        </div>
      </md-card-content>
    </md-card>

    <md-dialog :md-active.sync="showCreateDialog">
      <md-dialog-title>{{ editingUser ? $t('users.edit') : $t('users.add') }}</md-dialog-title>

      <md-dialog-content>
        <form @submit.prevent="saveUser" class="user-form" novalidate>
          <md-field :class="{ 'md-invalid': nameError }">
            <label>Name</label>
            <md-input
                v-model="userForm.name"
                type="email"
                @input="validateName"
                required>
            </md-input>
            <span class="md-error" v-if="nameError">{{ nameError }}</span>
          </md-field>
          <md-field :class="{ 'md-invalid': emailError }">
            <label>Email</label>
            <md-input
                v-model="userForm.email"
                type="email"
                @input="validateEmail"
                required>
            </md-input>
            <span class="md-error" v-if="emailError">{{ emailError }}</span>
          </md-field>

          <md-field :class="{ 'md-invalid': roleError }">
            <label>Role</label>
            <md-select
                v-model="userForm.role"
                @md-selected="validateRole"
                required>
              <md-option value="REGULAR_USER">Regular User</md-option>
              <md-option value="SUPER_ADMIN">Super Admin</md-option>
            </md-select>
            <span class="md-error" v-if="roleError">{{ roleError }}</span>
          </md-field>

          <md-field :class="{ 'md-invalid': passwordError }">
            <label>Password</label>
            <md-input
                v-model="userForm.password"
                type="password"
                @input="validatePassword"
                required>
            </md-input>
            <span class="md-error" v-if="passwordError">{{ passwordError }}</span>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-secondary" @click="closeDialog">Cancel</md-button>
        <md-button
            class="md-primary"
            @click="saveUser"
            :disabled="!isFormValid || isLoading">
          Save
        </md-button>
      </md-dialog-actions>
    </md-dialog>

   <md-dialog-confirm
        :md-active.sync="showDeleteDialog"
        :md-title="$t('users.delete')"
        :md-content="$t('users.deleteConfirm')"
        :md-confirm-text="$t('common.confirm')"
        :md-cancel-text="$t('common.cancel')"
        @md-cancel="onDeleteCancel"
        @md-confirm="onDeleteConfirm"
    />
  </div>
</template>

<script>
export default {

  name: 'Users',

  data() {
    return {
      showCreateDialog: false,
      showDeleteDialog: false,
      editingUser: null,
      userToDelete: null,
      userForm: {
        name: '',
        email: '',
        role: 'USER',
        password: ''
      },
      nameError: null,
      emailError: null,
      roleError: 'Role is required',
      passwordError: null,
      usersList: []
    }
  },

  computed: {
    isFormValid() {
      if (this.editingUser) {
        return !this.emailError && !this.roleError &&
            this.userForm.email && this.userForm.role;
      }
      return !this.emailError && !this.roleError && !this.passwordError &&
          this.userForm.email && this.userForm.role && this.userForm.password;
    },
    isLoading() {
      return this.$store.state.users.loading
    }
  },

  methods: {
    closeDialog() {
      this.showCreateDialog = false;
      this.resetForm();
    },

    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.userForm.email) {
        this.emailError = 'Email is required';
      } else if (!emailRegex.test(this.userForm.email)) {
        this.emailError = 'Please enter a valid email address';
      } else {
        this.emailError = null;
      }
    },

    validateName() {
      const validName = (this.userForm.name) ? (this.userForm.name).length > 0 : false;
      this.nameError = validName ? null : 'Name is required';
    },

    validateRole() {
      if (this.userForm.role) {
        this.roleError = null;
      } else {
        this.roleError = 'Role is required';
      }
    },

    validatePassword() {
      if (!this.editingUser) {
        if (!this.userForm.password) {
          this.passwordError = 'Password is required';
        } else if (this.userForm.password.length < 6) {
          this.passwordError = 'Password must be at least 6 characters';
        } else if (!/\d/.test(this.userForm.password)) {
          this.passwordError = 'Password must contain at least one number';
        } else {
          this.passwordError = null;
        }
      }
    },

    validateForm() {
      this.validateEmail();
      this.validateRole();
      this.validateName();
      if (!this.editingUser) {
        this.validatePassword();
      }
      return this.isFormValid;
    },

    async fetchUsers() {
      try {
        await this.$store.dispatch('users/fetchUsers')
        this.usersList = this.$store.state.users.users
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },

    editUser(user) {
      this.editingUser = user
      this.editingUser.password = '';
      this.userForm = { ...user }
      this.userForm.password = '';
      this.roleError = null;
      this.showCreateDialog = true
    },

    confirmDelete(user) {
      this.userToDelete = user
      this.showDeleteDialog = true
    },

    resetForm() {
      this.userForm = {
        name: '',
        email: '',
        role: 'REGULAR_USER',
        password: ''
      }
      this.editingUser = null
    },

    async saveUser() {
      if (!this.validateForm()) {
        return;
      }
      try {
        if (this.editingUser) {
          delete this.userForm.lastLogin;
          if( this.userForm.password === null || this.userForm.password === undefined || this.userForm.password === '') {
            delete this.userForm.password;
          }
          await this.$store.dispatch('users/updateUser', {
            id: this.editingUser.id,
            userData: this.userForm
          })
        } else {
          await this.$store.dispatch('users/createUser', this.userForm)
        }
        this.showCreateDialog = false
        this.resetForm()
        await this.fetchUsers()
      } catch (error) {
        console.error('Error saving user:', error)
      }
    },

    onDeleteCancel() {
      this.userToDelete = null
    },

    async onDeleteConfirm() {
      if (this.userToDelete) {
        try {
          await this.$store.dispatch('users/deleteUser', this.userToDelete.id)
          await this.fetchUsers()
        } catch (error) {
          console.error('Error deleting user:', error)
        }
        this.userToDelete = null
      }
    }
  },

  async created() {
    await this.fetchUsers()
  }
}
</script>

<style lang="scss" scoped>
.users-container {
  padding: 20px;

  .md-card {
    margin: 16px;

    .md-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }
  }
}
</style>