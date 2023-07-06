<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();

const router = useRouter();
const route = useRoute();
const demande = computed(() => store.state.selectedDemande);

onMounted(() => {
    const id = route.params.id || store.state.selectedDemande.id;
    store.dispatch('getDemandeById', id);
});
const traiter = () => {
    router.push('/step2');
};
</script>

<template>
    <div class="card p-fluid">
        <div class="font-medium text-3xl text-900 mb-3">Demande:</div>
        <div class="surface-section" v-if="demande.id">
            <div class="text-500 mb-5"></div>
            <ul class="list-none p-0 m-0">
                <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Intitule</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ demande.intitule }}</div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Type</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {{ demande.type }}
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Commanditaire mission</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ demande.client.nom + ' ' + demande.client.prenom }} <br />{{ demande.client.email }}</div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Budget</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {{ demande.budget + ' DH' }}
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Objectif</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ demande.objectif }}</div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Profiles</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ demande.profils_participants }}</div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>

                <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">domaines des competences</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        <Chip label="Crime" class="mr-2" v-for="(item, index) in demande.domaines_competences.split(',')" :key="index">{{ item }}</Chip>
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Durée</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        {{ demande.duree }}
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Nombre de participant</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        {{ demande.nbr_participants }}
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Date debut de la formation</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        {{ demande.date_debut }}
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Date fin de la formation</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        {{ demande.date_fin }}
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Lieu de la formation</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        {{ demande.adresse }}
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
                <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div class="text-500 w-6 md:w-2 font-medium">Document support</div>
                    <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <a :href="demande.documents[0].filepath" target="_blank" rel="noopener noreferrer">
                            <i class="pi pi-file" style="font-size: 1.5rem"></i>
                            {{ demande.documents[0].filename }}
                        </a>
                    </div>
                    <div class="w-6 md:w-2 flex justify-content-end"></div>
                </li>
            </ul>
        </div>
        <div class="flex flex-wrap align-items-start justify-content-start mt-4">
            <!-- <Button label="Envoyer" icon="pi pi-send" iconPos="right" class="p-button-secondary mr-2 mb-2 w-11rem" />
            <Button label="éditer" icon="pi pi-pencil" iconPos="right" class="p-button-primary mr-2 mb-2 w-11rem" /> -->
            <Button :label="store.state.user.roles[0].name !== 'client' ? 'Traiter' : 'Consulter les propositions'" icon="pi pi-pencil" iconPos="right" class="p-button-primary mr-2 mb-2 w-19rem" @click="traiter" />
        </div>
    </div>
</template>

<style></style>
