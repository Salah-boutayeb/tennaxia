<script setup>
import { computed, onMounted, onBeforeMount, reactive, ref, watch } from 'vue';

import Demandes from '@/components/Demandes.vue';
import { useLayout } from '@/layout/composables/layout';
const { isDarkTheme, contextPath } = useLayout();
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore();

const demandes = computed(() => store.state.demandes);
const clients = computed(() => store.state.clients);
const missions = computed(() => store.state.missions);
const products = ref(null);
const notifs = ref([
    { name: 'Amy Elsner', message: 'a validé votre proposition' },
    { name: 'Anna Fali', message: 'a effectué une demmande de formation' },
    { name: 'Asiya Javayant', message: 'une mission facturée' },
    { name: 'Bernardo Dominic', message: 'a refusé la mission' }
]);

const items = ref([{ label: 'Add New', icon: 'pi pi-fw pi-plus' }]);
const lineOptions = ref(null);

onMounted(() => {
    store.dispatch('allDemandes');
    store.dispatch('allClients');
    store.dispatch('allMissions');
    store.commit('INIT_PROCESS');
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
const router = useRouter();
const create = () => {
    router.push('/demande_create');
};
</script>

<template>
    <div class="grid grid-nogutter surface-section text-800" v-if="store.state.user.roles[0].name === 'client'">
        <div class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
            <section>
                <span class="block text-4xl font-bold mb-1">Bienvenue sur votre espace {{ '(' + store.state.user.roles[0].name + ')' }}</span>
                <div class="text-6xl text-primary font-bold mb-3">{{ store.state.user.nom + ' ' + store.state.user.prenom }}</div>
                <!-- <p class="mt-0 mb-4 text-700 line-height-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> -->

                <Button label="Céer une nouvelle demande" type="button" @click="create()" class="mr-3 p-button-raised"> </Button>
                <!-- <Button label="Consulter vos demandes" type="button" class="p-button-outlined"></Button> -->
            </section>
        </div>
        <div class="col-12 md:col-6 overflow-hidden">
            <img src="/demo/images/blocks/hero/hero-1.png" alt="Image" class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
        </div>
    </div>

    <div class="grid mt-4">
        <div class="col-12 md:col-9 lg:col-9" v-if="store.state.user.roles[0].name !== 'client'">
            <div class="grid">
                <div v-if="store.state.user.roles[0].name !== 'client'" class="col-12 grid">
                    <div class="col-12 lg:col-6 xl:col-4">
                        <div class="card mb-0">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">Clients</span>
                                    <div class="text-900 font-medium text-xl">{{ clients.length }}</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-users text-blue-500 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 lg:col-6 xl:col-4">
                        <div class="card mb-0">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">Missions</span>
                                    <div class="text-900 font-medium text-xl">{{ missions.length }}</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-bookmark text-orange-500 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 lg:col-6 xl:col-4">
                        <div class="card mb-0">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">Demandes</span>
                                    <div class="text-900 font-medium text-xl">{{ demandes.length }}</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <Demandes :demandes="demandes" />
                </div>
            </div>
        </div>
        <div class="col-12 md:col-3 lg:col-3" v-if="store.state.user.roles[0].name !== 'client'">
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Notifications</h5>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items"></Menu>
                    </div>
                </div>

                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li v-for="notif in notifs" :key="notif.name" class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-question text-xl text-pink-500"></i>
                        </div>
                        <span class="text-900 line-height-3"
                            >{{ notif.name }}
                            <span class="text-700"> {{ notif.message }} </span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="flex align-items-center justify-content-between mb-4">
            <h5>Catalogue de formations</h5>
            <div v-if="store.state.user.roles[0].name !== 'client'">
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
            </div>
        </div>

        <Accordion :activeIndex="0">
            <AccordionTab header="Formation I">
                <p class="line-height-3 m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </AccordionTab>
            <AccordionTab header="Formation II">
                <p class="line-height-3 m-0">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                </p>
            </AccordionTab>
            <AccordionTab header="Formation III">
                <p class="line-height-3 m-0">
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                    officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                </p>
            </AccordionTab>
        </Accordion>
    </div>
</template>
