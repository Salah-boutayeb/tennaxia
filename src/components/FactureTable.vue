<script setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue';

import { useStore } from 'vuex';

const store = useStore();

const factures = computed(() => store.state.factures);
onBeforeMount(() => {
    store.dispatch('allFactures');

    store.commit('INIT_PROCESS');
});
const submitted = ref(false);
const factureDialog = ref(false);
const facture = ref({});

const statuses = ref([
    { label: 'reçu', value: 'RECU' },
    { label: 'validée', value: 'VALIDEE' },
    { label: 'à régler', value: 'AREGLER' },
    { label: 'payée', value: 'PAYEE' },
    { label: 'retard', value: 'RETARD' }
]);

const openNew = () => {
    facture.value = {};
    submitted.value = false;
    factureDialog.value = true;
};
const editingRows = ref([]);
const onRowEditSave = (event) => {
    let { newData, index } = event;

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('num_facture', newData.num_facture);
    // formData.append('echeance', newData.echeance);
    formData.append('montant_ht', newData.montant_ht);
    formData.append('montant_ttc', newData.montant_ht * 1.2);
    formData.append('facture', facture.value.facture);
    formData.append('facture_id', newData.documents[0].id);
    console.log('montant_ht', newData.montant_ht, 'montant_ttc', newData.montant_ht * 1.2);
    store.dispatch('updateFacture', { facture: formData, factureId: newData.id });
    facture.value = {};
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'RECU':
            return 'info';

        case 'VALIDEE':
            return 'success';

        case 'AREGLER':
            return 'warning';
        case 'PAYEE':
            return 'success';
        case 'RETARD':
            return 'danger';

        default:
            return null;
    }
};
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(value);
};

const deleteFacture = (facture) => {
    store.dispatch('updatefacture', facture);
};
const saveFacture = () => {
    const formData = new FormData();

    facture.value.mission_id = store.state.selectedDemande.mission.id;
    formData.append('num_facture', facture.value.num_facture);
    formData.append('echeance', facture.value.echeance.label);
    formData.append('montant', facture.value.montant);
    formData.append('mission_id', facture.value.mission_id);
    formData.append('facture', facture.value.facture);
    console.log(facture.value);
    store.dispatch('saveFacture', formData);
    facture.value = {};
};

const appendFactureFile = (files) => {
    facture.value.facture = files[0];
};
</script>

<template>
    <Toast />
    <Toolbar class="mb-4">
        <template v-slot:start>
            <h5>Factures</h5>
        </template>
        <template v-slot:end>
            <!-- <Button label="Nouvelle Facture" icon="pi pi-plus" class="p-button-info mr-2" @click="openNew" /> -->
        </template>
    </Toolbar>
    <div class="card p-fluid">
        <DataTable v-model:editingRows="editingRows" :value="factures" paginator :scrollable="true" :rows="4" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" tableClass="editable-cells-table">
            <Column field="num_facture" header="Num° facture" style="width: 20%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="client" header="client" style="width: 20%">
                <template #body="{ data }">
                    <span>{{ `${data.mission.client.entite}` }}</span>
                </template>
            </Column>
            <Column field="agent" header="agent" style="width: 20%">
                <template #body="{ data }">
                    <span>{{ `${data.mission.client.nom} ${data.mission.client.prenom} ` }}</span>
                </template>
            </Column>
            <Column field="montant_ht" header="montant HT" style="width: 30%">
                <template #body="{ data, field }">
                    {{ formatCurrency(data[field]) }}
                </template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" mode="currency" currency="MAD" locale="en-US" />
                </template>
            </Column>
            <Column field="type" header="type" style="width: 30%">
                <!-- <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value" placeholder="Select a Status">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.value" :severity="getStatusLabel(slotProps.option.value)" />
                        </template>
                    </Dropdown>
                </template> -->
                <template #body="slotProps">
                    <Tag :value="slotProps.data.type" :severity="'info'" />
                </template>
            </Column>
            <Column field="documents" header="facture" style="width: 30%">
                <template #editor="{ data, field }">
                    <input type="file" name="convention" id="convention" v-if="!convention" @change="appendFactureFile($event.target.files)" />
                </template>
                <template #body="slotProps">
                    <a :href="slotProps.data.documents[0].filepath" class="">{{ slotProps.data.documents[0].filename }}</a>
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 5%; min-width: 0.5rem" bodyStyle="text-align:center"></Column>
            <Column style="width: 0.1rem" bodyStyle="text-align:center">
                <template #body="slotProps">
                    <!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="deleteFacture(slotProps.data)" /> -->
                </template>
            </Column>
        </DataTable>
        <Dialog v-model:visible="factureDialog" :style="{ width: '450px' }" header="Facture" :modal="true" class="p-fluid">
            <div class="field">
                <label class="mb-3">N° facture</label>
                <InputText v-model="facture.num_facture" />
            </div>
            <div class="field">
                <label class="mb-3">Montant HT</label>
                <InputNumber v-model="facture.montant_ht" inputId="currency-us" mode="currency" currency="MAD" />
            </div>
            <div class="field">
                <h5>Echéance</h5>
                <Dropdown v-model="facture.echeance" :options="statuses" optionLabel="label" placeholder="Select" />
            </div>
            <div class="field">
                <label class="mb-3">Documents de facture</label>
                <input type="file" name="contrat" id="contart" @change="appendFactureFile($event.target.files)" />
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveFacture" />
            </template>
        </Dialog>
    </div>
</template>

<style lang="scss" scoped>
::v-deep(.editable-cells-table td.p-cell-editing) {
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
}
</style>
