<!-- src/views/Users.vue -->
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
    <!-- User Form Dialog -->
    <md-dialog :md-active.sync="showCreateDialog">
      <md-dialog-title>{{ editingUser ? $t('users.edit') : $t('users.add') }}</md-dialog-title>

      <md-dialog-content>
        <form @submit.prevent="saveUser">
          <md-field>
            <label>{{ $t('users.form.email') }}</label>
            <md-input v-model="userForm.email" type="email" required></md-input>
          </md-field>

          <md-field>
            <label>{{ $t('users.form.role') }}</label>
            <md-select v-model="userForm.role" required>
              <md-option value="USER">User</md-option>
              <md-option value="ADMIN">Admin</md-option>
              <md-option value="SUPER_ADMIN">Super Admin</md-option>
            </md-select>
          </md-field>

          <md-field v-if="!editingUser">
            <label>{{ $t('users.form.password') }}</label>
            <md-input v-model="userForm.password" type="password" required></md-input>
          </md-field>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-secondary" @click="showCreateDialog = false">
          {{ $t('common.cancel') }}
        </md-button>
        <md-button class="md-primary" @click="saveUser" :disabled="isLoading">
          {{ $t('common.save') }}
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Delete Confirmation Dialog -->
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
        email: '',
        role: 'USER',
        password: ''
      },
      usersList: []  // Initialize as empty array
    }
  },

  computed: {
    isLoading() {
      return this.$store.state.users.loading
    }
  },

  methods: {
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
      this.userForm = { ...user }
      this.showCreateDialog = true
    },

    confirmDelete(user) {
      this.userToDelete = user
      this.showDeleteDialog = true
    },

    resetForm() {
      this.userForm = {
        email: '',
        role: 'USER',
        password: ''
      }
      this.editingUser = null
    },

    async saveUser() {
      try {
        if (this.editingUser) {
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