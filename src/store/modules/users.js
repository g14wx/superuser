import UsersService from '@/services/users.service'

export default {
    namespaced: true,

    state: {
        users: [],
        selectedUser: null,
        loading: false,
        error: null
    },

    getters: {
        getUsers: state => state.users,
        getSelectedUser: state => state.selectedUser,
        isLoading: state => state.loading,
        getError: state => state.error
    },

    mutations: {
        SET_USERS(state, users) {
            state.users = users
        },
        SET_SELECTED_USER(state, user) {
            state.selectedUser = user
        },
        ADD_USER(state, user) {
            state.users.push(user)
        },
        UPDATE_USER(state, updatedUser) {
            const index = state.users.findIndex(u => u.id === updatedUser.id)
            if (index !== -1) {
                state.users.splice(index, 1, updatedUser)
            }
        },
        REMOVE_USER(state, userId) {
            state.users = state.users.filter(u => u.id !== userId)
        },
        SET_LOADING(state, loading) {
            state.loading = loading
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        CLEAR_ERROR(state) {
            state.error = null
        }
    },

    actions: {
        async fetchUsers({ commit }) {
            try {
                commit('SET_LOADING', true)
                commit('CLEAR_ERROR')

                const { data } = await UsersService.getAll()
                commit('SET_USERS', data)

                return data
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to fetch users'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchUser({ commit }, id) {
            try {
                commit('SET_LOADING', true)
                commit('CLEAR_ERROR')

                const { data } = await UsersService.getById(id)
                commit('SET_SELECTED_USER', data)

                return data
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to fetch user'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async createUser({ commit }, userData) {
            try {
                commit('SET_LOADING', true)
                commit('CLEAR_ERROR')

                const { data } = await UsersService.create(userData)
                commit('ADD_USER', data)

                return data
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to create user'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async updateUser({ commit }, { id, userData }) {
            try {
                commit('SET_LOADING', true)
                commit('CLEAR_ERROR')

                const { data } = await UsersService.update(id, userData)
                commit('UPDATE_USER', data)

                return data
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to update user'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async deleteUser({ commit }, id) {
            try {
                commit('SET_LOADING', true)
                commit('CLEAR_ERROR')

                await UsersService.delete(id)
                commit('REMOVE_USER', id)
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to delete user'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        clearError({ commit }) {
            commit('CLEAR_ERROR')
        }
    }
}
