// src/router/guards.js
import store from '@/store'

export const authGuard = (to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isGuestRoute = to.matched.some(record => record.meta.guest)

    // If route requires auth and user is not authenticated
    if (requiresAuth && !isAuthenticated) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
        return
    }

    // If it's a guest route (like login) and user is authenticated
    if (isGuestRoute && isAuthenticated) {
        // If there's a redirect parameter, use it; otherwise go to dashboard
        const redirectPath = to.query.redirect || '/dashboard'
        if (to.path !== redirectPath) {
            next(redirectPath)
            return
        }
    }

    // In all other cases, just proceed
    next()
}

export const roleGuard = (allowedRoles) => {
    return (to, from, next) => {
        const userRole = store.getters['auth/getUser']?.role

        if (!userRole || !allowedRoles.includes(userRole)) {
            next({ path: '/dashboard' })
            return
        }

        next()
    }
}

// Helper function to validate JWT token
const validateToken = (token) => {
    if (!token) return false

    try {
        const tokenData = JSON.parse(atob(token.split('.')[1]))
        return tokenData.exp * 1000 > Date.now()
    } catch {
        return false
    }
}

export const globalGuard = async (to, from, next) => {
    const token = localStorage.getItem('token')
    const isAuthenticated = store.getters['auth/isAuthenticated']

    // If we have a token but it's invalid
    if (token && !validateToken(token)) {
        // Clear the invalid token
        store.dispatch('auth/logout')
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
        return
    }

    // Run the main auth guard
    authGuard(to, from, next)
}