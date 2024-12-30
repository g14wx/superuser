import api from './axios'

export default {
    getAll() {
        return api.get('/users')
    },
    getById(id) {
        return api.get(`/users/${id}`)
    },
    create(userData) {
        return api.post('/users', userData)
    },
    update(id, userData) {
        return api.put(`/users/${id}`, userData)
    },
    delete(id) {
        return api.delete(`/users/${id}`)
    }
}