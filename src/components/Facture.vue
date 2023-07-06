<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const toast = useToast();

let factureTypes = ref([
    { name: 'Facture Fournisseur', type: 'fournisseur' },
    { name: 'Facture Client', type: 'client' }
]);
const facture = ref({
    montant_ht: 0,
    montant_ttc: 0
});

const toTTC = (value) => {
    facture.value.montant_ttc = value * 1.2;
};
const position = ref('center');
const visible = ref(false);

const openPosition = (pos) => {
    position.value = pos;
    visible.value = true;
};

const appendFactureFile = (files) => {
    facture.value.facture = files[0];
};
const saveFacture = async () => {
    const formData = new FormData();

    facture.value.mission_id = store.state.selectedDemande.mission.id;
    console.log(facture.value);
    formData.append('num_facture', facture.value.num_facture);
    formData.append('type', facture.value.type.type);
    formData.append('montant_ttc', facture.value.montant_ttc);
    formData.append('montant_ht', facture.value.montant_ht);
    formData.append('mission_id', facture.value.mission_id);
    formData.append('etat', 'reçu');
    formData.append('facture', facture.value.facture);
    visible.value = false;
    await store.dispatch('saveFacture', formData).then((response) => {
        console.log('response', response);
        toast.add({ severity: 'warning', summary: 'Success', detail: response, life: 3000 });
    });

    facture.value = {};
};
</script>

<template>
    <div class="">
        <div class="flex flex-wrap justify-content-center">
            <Button label="Ajouter Factures" icon="pi pi-arrow-down" @click="openPosition('top')" severity="warning" style="min-width: 10rem" />
        </div>

        <Dialog v-model:visible="visible" header="Header" :style="{ width: '50vw' }" :position="position" :modal="true" :draggable="false">
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-6">
                    <label for="num_facture">N° facture</label>
                    <InputText id="firstname2" v-model="facture.num_facture" />
                </div>
                <div class="field col-12 md:col-3">
                    <label for="state">Type de facture</label>
                    <Dropdown id="state" v-model="facture.type" :options="factureTypes" optionLabel="name" placeholder="Select One"></Dropdown>
                </div>
                <div class="field col-12 md:col-6">
                    <label for="lastname2">Montant HT</label>
                    <InputNumber id="montant_ht" v-model="facture.montant_ht" @input="toTTC($event.value)" />
                </div>
                <div class="field col-12 md:col-6">
                    <label for="lastname2">Montant TTC</label>
                    <InputNumber id="montant_ttc" v-model="facture.montant_ttc" />
                </div>

                <div class="field col-12 md:col-6">
                    <input type="file" @change="appendFactureFile($event.target.files)" name="contrat" id="contart" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="visible = false" text />
                <Button label="Save" icon="pi pi-check" @click="saveFacture()" autofocus />
            </template>
        </Dialog>
    </div>
</template>
