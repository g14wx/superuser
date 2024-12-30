<template>
  <div class="users">
    <md-card>
      <md-card-header>
        <div class="md-title">{{ $t('users.title') }}</div>
        <md-button class="md-primary md-raised" @click="showCreateDialog = true">
          {{ $t('users.addNew') }}
        </md-button>
      </md-card-header>

      <md-card-content>
        <md-table v-model="users" md-sort="email" md-sort-order="asc" md-card md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h1 class="md-title">{{ $t('users.list') }}</h1>
            </div>
            <md-field class="md-toolbar-section-end">
              <md-input v-model="search" :placeholder="$t('users.search')" />
            </md-field>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
            <md-table-cell md-label="Role" md-sort-by="role">{{ item.role }}</md-table-cell>
            <md-table-cell md-label="Actions">
              <md-button class="md-icon-button" @click="editUser(item)">
                <md-icon>edit</md-icon>
              </md-button>
              <md-button class="md-icon-button md-accent" @click="confirmDelete(item)">
                <md-icon>delete</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>

        <!-- User Form Dialog -->
        <user-form
            v-if="showCreateDialog"
            :show="showCreateDialog"
            :user="selectedUser"
            @close="closeDialog"
            @save="saveUser"
        />

        <!-- Delete Confirmation Dialog -->
        <md-dialog-confirm
            :md-active.sync="showDeleteDialog"
            :md-title="$t('users.deleteConfirmTitle')"
            :md-content="$t('users.deleteConfirmContent')"
            :md-confirm-text="$t('common.confirm')"
            :md-cancel-text="$t('common.cancel')"
            @md-confirm="deleteUser"
        />
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UserForm from '@/components/UserForm.vue'

export default {
  name: 'Users',
  components: {
    UserForm
  },
  data() {
    return {
      search: '',
      showCreateDialog: false,
      showDeleteDialog: false,
      selectedUser: null
    }
  },
  computed: {
    ...mapState('users', ['users', 'loading'])
  },
  methods: {
    ...mapActions('users', ['fetchUsers', 'createUser', 'updateUser', 'deleteUser']),

    editUser(user) {
      this.selectedUser = { ...user }
      this.showCreateDialog = true
    },

    confirmDelete(user) {
      this.selectedUser = user
      this.showDeleteDialog = true
    },

    closeDialog() {
      this.showCreateDialog = false
      this.selectedUser = null
    },

    async saveUser(userData) {
      try {
        if (userData.id) {
          await this.updateUser({ id: userData.id, userData })
        } else {
          await this.createUser(userData)
        }
        this.closeDialog()
      } catch (error) {
        this.$root.$emit('show-error', error.message)
      }
    }
  },
  created() {
    this.fetchUsers()
  }
}
</script>