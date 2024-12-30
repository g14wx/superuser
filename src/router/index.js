import Vue from 'vue'
import VueRouter from 'vue-router'
import { globalGuard, roleGuard } from './guards'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: () => import('@/views/Landing.vue'),
        meta: { guest: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { guest: true }
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/ResetPassword.vue'),
        meta: { guest: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: {
            requiresAuth: true
        },
        beforeEnter: roleGuard(['ADMIN', 'SUPER_ADMIN'])
    },
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: () => import('@/views/ChangePassword.vue'),
        props: (route) => ({ token: route.query.token })
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach(globalGuard)

export default router