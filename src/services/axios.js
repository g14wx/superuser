import axios from 'axios'
import store from '@/store'
import router from '@/router'

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    store.dispatch('auth/logout')
                    router.push('/login')
                    break
                case 403:
                    // Forbidden
                    router.push('/dashboard')
                    break
            }
        }
        return Promise.reject(error)
    }
)

export default api