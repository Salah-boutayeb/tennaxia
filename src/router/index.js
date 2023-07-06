import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import store from '../store';
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                /* dev starts here */
                {
                    path: '/',
                    name: 'Dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/missions_create',
                    name: 'missionsForm',
                    component: () => import('@/views/dms/FormationForm.vue')
                },
                {
                    path: '/missions_list',
                    name: 'missionsList',
                    component: () => import('@/views/dms/MissionList.vue')
                },
                {
                    path: '/demandes',
                    name: 'demandesList',
                    component: () => import('@/views/dms/Demandes.vue')
                },
                {
                    path: '/demande_create',
                    name: 'demandes',
                    component: () => import('@/views/dms/Demande.vue')
                },
                {
                    path: '/demande/:id',
                    name: 'demande_view',
                    component: () => import('@/views/dms/workflow/DemandeView.vue')
                },
                {
                    path: '/factures',
                    name: 'factures',
                    component: () => import('@/views/dms/Facture.vue')
                },
                {
                    path: '/clients',
                    name: 'clients',
                    component: () => import('@/views/dms/Client.vue')
                },
                {
                    path: '/chat',
                    name: 'chat',
                    component: () => import('@/views/dms/Chat.vue')
                },
                {
                    path: '/process',
                    name: 'process',
                    component: () => import('@/views/dms/Menu.vue'),
                    children: [
                        {
                            path: '/step1/:id',
                            component: () => import('@/views/dms/workflow/DemandeView.vue')
                        },
                        {
                            path: '/step2',
                            component: () => import('@/views/dms/workflow/Step2.vue')
                        },
                        {
                            path: '/step3',
                            component: () => import('@/views/dms/workflow/Step3.vue')
                        },
                        {
                            path: '/step4',
                            component: () => import('@/views/dms/workflow/Step4.vue')
                        },
                        {
                            path: '/step5',
                            component: () => import('@/views/dms/workflow/Step5.vue')
                        }
                    ]
                },
                {
                    path: '/formateur',
                    name: 'fromateur',
                    component: () => import('@/views/dms/CrudFormateur.vue')
                }

                /*  it ends here */
            ]
        },
        {
            path: '/auth/logout',
            name: 'logout',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/auth/Error.vue')
        }
    ]
});
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.status.loggedIn) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;
