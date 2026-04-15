import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import Login from '../components/Login.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            alias: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            meta: { requiresAuth: false }
        },
        {
            path: '/admin/plans',
            name: 'AdminPlans',
            component: () => import('../components/AdminTravelPlans.vue'),
            meta: { requiresAuth: true, requiresAdmin: true }
        },
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
        next('/');
    } else {
        next();
    }
});


export default router;