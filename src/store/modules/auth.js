import AuthService from '@/services/auth.service'

export default {
    namespaced: true,

    state: {
        token: localStorage.getItem('token') || null,
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        loading: false,
        error: null
    },

    getters: {
        isAuthenticated: state => !!state.token,
        getUser: state => state.user,
        getError: state => state.error,
        isLoading: state => state.loading
    },

    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            if (token) {
                localStorage.setItem('token', token)
            } else {
                localStorage.removeItem('token')
            }
        },
        SET_USER(state, user) {
            state.user = user
            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
            } else {
                localStorage.removeItem('user')
            }
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
        async login({ commit }, credentials) {
            try {
                commit('SET_LOADING', true)
                commit('CLEAR_ERROR')

                const { data } = await AuthService.login(credentials)

                commit('SET_TOKEN', data.token)
                commit('SET_USER', {
                    email: data.email,
                    role: data.role
                })

                return data
            } catch (error) {
                const message = error.response?.data?.message || 'Login failed'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async resetPassword({ commit }, email) {
            try {
                commit('SET_LOADING', true)
                commit('CLEAR_ERROR')

                await AuthService.resetPassword(email)
            } catch (error) {
                const message = error.response?.data?.message || 'Password reset failed'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        logout({ commit }) {
            commit('SET_TOKEN', null)
            commit('SET_USER', null)
            localStorage.removeItem('token')
        },

        clearError({ commit }) {
            commit('CLEAR_ERROR')
        }
    }
}