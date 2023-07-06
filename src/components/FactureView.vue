<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Facture from '@/components/Facture.vue';
const store = useStore();

const facture_client = computed(() => store.state.selectedDemande.facture_client);
const facture_fournisseur = computed(() => store.state.selectedDemande.facture_fournisseur);

const toast = useToast();

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const deleteFactureFournisseur = (factureId) => {
    store.dispatch('deleteFactureFournisseur', { factureId });
};
const deleteFactureClient = (factureId) => {
    store.dispatch('deleteFactureClient', { factureId });
};

const getSeverity = (status) => {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'validée':
            return 'info';

        case 'reçu':
            return 'info';

        case 'renewal':
            return null;
    }
};
</script>

<template>
    <Toast />
    <Toolbar class="mb-4" v-if="store.state.user.roles[0].name !== 'client' && (!facture_fournisseur || !facture_client)">
        <template v-slot:start>
            <h4 v-if="!facture_fournisseur && !facture_client">Aucune facture est ajoutée !</h4>
            <h4 v-else-if="!facture_client">Ajoutez une facture client !</h4>
            <h4 v-else-if="!facture_fournisseur">Ajoutez facture fournisseur !</h4>
        </template>
        <template v-slot:end>
            <facture />
        </template>
    </Toolbar>

    <div class="surface-section" v-if="facture_client">
        <div class="font-medium text-3xl text-900 mb-3">Facture Client</div>
        <ul class="list-none p-0 m-0">
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">facture Client:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ facture_client.num_facture }}</div>
                <div class="w-6 md:w-2 flex justify-content-end">
                    <Button label="Delete" icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteFactureClient(facture_client.id)"></Button>
                </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Etat:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    <p class="text-xl font-medium" v-if="facture_client.etat"><Tag :value="facture_client.etat ? facture_client.etat : 'reçu'" :severity="getSeverity(facture_client.etat ? facture_client.etat : 'reçu')" /></p>
                </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Payée:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><i class="pi" :class="{ 'text-green-500 pi-check-circle': facture_client.estPayee, 'text-pink-500 pi-times-circle': !facture_client.estPayee }"></i></div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Montant TTC</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ facture_client.montant_ttc }} DH</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Montant HT</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{{ facture_client.montant_ht }} DH</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">facture:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                    <a :href="facture_client.documents[0].filepath" target="_blank" rel="noopener noreferrer">{{ facture_client.documents[0].filename }}</a>
                </div>
            </li>
        </ul>
    </div>
    <div class="surface-section pt-3" v-if="facture_fournisseur && store.state.user.roles[0].name !== 'client'">
        <div class="font-medium text-3xl text-900 mb-3">Facture Fournisseur</div>
        <ul class="list-none p-0 m-0">
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">facture fournisseur:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ facture_fournisseur.num_facture }}</div>
                <div class="w-6 md:w-2 flex justify-content-end">
                    <Button label="Delete" icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteFactureFournisseur(facture_fournisseur.id)"></Button>
                </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Etat:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    <p class="text-xl font-medium" v-if="facture_fournisseur.etat"><Tag :value="facture_fournisseur.etat ? facture_fournisseur.etat : 'reçu'" :severity="getSeverity(facture_fournisseur.etat ? facture_fournisseur.etat : 'reçu')" /></p>
                </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Payée:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><i class="pi" :class="{ 'text-green-500 pi-check-circle': facture_fournisseur.estPayee, 'text-pink-500 pi-times-circle': !facture_fournisseur.estPayee }"></i></div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Montant TTC</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ facture_fournisseur.montant_ttc }} DH</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">Montant HT</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{{ facture_fournisseur.montant_ht }} DH</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                <div class="text-500 w-6 md:w-2 font-medium">facture:</div>
                <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                    <a :href="facture_fournisseur.documents[0].filepath" target="_blank" rel="noopener noreferrer">{{ facture_fournisseur.documents[0].filename }}</a>
                </div>
            </li>
        </ul>
    </div>
</template>

<style></style>
