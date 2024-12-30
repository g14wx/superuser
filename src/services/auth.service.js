import api from './axios'

export default {
    login(credentials) {
        return api.post('/auth/login', credentials)
    },
    resetPassword(email) {
        return api.post('/auth/password-reset/request?email=' + email)
    },
    changePassword(data) {
        return api.post('/auth/change-password', data)
    }
}