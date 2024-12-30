import store from '@/store'

export const authGuard = (to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isGuestRoute = to.matched.some(record => record.meta.guest)

    if (requiresAuth && !isAuthenticated) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
        return
    }

    if (isGuestRoute && isAuthenticated) {
        const redirectPath = to.query.redirect || '/dashboard'
        if (to.path !== redirectPath) {
            next(redirectPath)
            return
        }
    }

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

    if (token && !validateToken(token)) {
        store.dispatch('auth/logout')
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
        return
    }

    authGuard(to, from, next)
}