// src/store/modules/users.js
import UsersService from '@/services/users.service'

export default {
    namespaced: true,

    state: {
        users: [],      // Initialize as empty array
        loading: false,
        error: null
    },

    getters: {
        getUsers: state => state.users
    },

    mutations: {
        SET_USERS(state, users) {
            state.users = users
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
        DELETE_USER(state, userId) {
            state.users = state.users.filter(u => u.id !== userId)
        },
        SET_LOADING(state, loading) {
            state.loading = loading
        },
        SET_ERROR(state, error) {
            state.error = error
        }
    },

    actions: {
        async fetchUsers({ commit }) {
            commit('SET_LOADING', true)
            try {
                const { data } = await UsersService.getAll()
                commit('SET_USERS', data)
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async createUser({ commit }, userData) {
            commit('SET_LOADING', true)
            try {
                const { data } = await UsersService.create(userData)
                commit('ADD_USER', data)
                return data
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async updateUser({ commit }, { id, userData }) {
            commit('SET_LOADING', true)
            try {
                const { data } = await UsersService.update(id, userData)
                commit('UPDATE_USER', data)
                return data
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async deleteUser({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                await UsersService.delete(id)
                commit('DELETE_USER', id)
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        }
    }
}