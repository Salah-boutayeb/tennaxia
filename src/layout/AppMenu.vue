<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import { useStore } from 'vuex';
const store = useStore();
const clientItems = [
    {
        label: '',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Formations',
        items: [{ label: 'Demandes', icon: 'pi pi-fw pi-briefcase', to: '/demandes' }]
    }
];

const gestionnaireItems = [
    {
        label: '',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Géstion des formations',
        items: [
            {
                label: 'Missions',
                icon: 'pi pi-fw pi-book',

                items: [
                    {
                        label: 'créer une mission',
                        icon: 'pi pi-fw pi-align-justify',
                        to: '/demande_create'
                    },
                    {
                        label: 'Consulter les missions',
                        icon: 'pi pi-fw pi-align-justify',
                        to: '/missions_list'
                    }
                ]
            },

            { label: 'Clients', icon: 'pi pi-fw pi-users', to: '/clients' },
            { label: 'Demandes', icon: 'pi pi-fw pi-briefcase', to: '/' },
            { label: 'Factures', icon: 'pi pi-fw pi-money-bill', to: '/factures' }
        ]
    }
    // {
    //     label: 'Client',
    //     items: [
    //         { label: 'Home', icon: 'pi pi-fw pi-users', to: '/client' },
    //         { label: 'demandes', icon: 'pi pi-fw pi-briefcase', to: '/demandes_client' },
    //         { label: 'missions', icon: 'pi pi-fw pi-book', to: '/step1_client' }
    //         // { label: 'propositions', icon: 'pi pi-fw pi-align-justify', to: '/propositions_client' }
    //     ]
    // }
];
const model = store.state.user.roles[0].name === 'client' ? ref(clientItems) : ref(gestionnaireItems);
</script>

<template class="">
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
