<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { useStore } from 'vuex';
import TimeFormater from '@/service/utils/TimeFormater';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const toast = useToast();
const { contextPath } = useLayout();

const propositions = computed(() => store.getters['getPropositions']);
const propositionDialog = ref(false);
const deletePropositionDialog = ref(false);
const deletepropositionsDialog = ref(false);
const proposition = ref();
const selectedpropositions = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const dropdownValues = ref([
    { name: 'intra', code: 'NY' },
    { name: 'inter', code: 'RM' },
    { name: 'visio', code: 'LDN' },
    { name: 'conference', code: 'IST' }
]);
const openNew = () => {
    proposition.value = {};
    submitted.value = false;
    propositionDialog.value = true;
};

const hideDialog = () => {
    propositionDialog.value = false;
    submitted.value = false;
};

const editeProposition = (editeProposition) => {
    proposition.value = { ...editeProposition };
    proposition.value.prix = Number(editeProposition.prix);
    proposition.value.date_debut = TimeFormater.formatDate(proposition.value.date_debut);
    proposition.value.date_fin = TimeFormater.formatDate(proposition.value.date_fin);

    propositionDialog.value = true;
};

const confirmDeleteProduct = (editeProposition) => {
    proposition.value = editeProposition;
    deletePropositionDialog.value = true;
};

const deleteProduct = () => {
    store
        .dispatch('deleteProposition', { propositionId: proposition.value.id })
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch(() => {});

    deletePropositionDialog.value = false;
    proposition.value = {};
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < propositions.value.length; i++) {
        if (propositions.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const confirmDeleteSelected = () => {
    deletepropositionsDialog.value = true;
};
const deleteSelectedpropositions = () => {
    propositions.value = propositions.value.filter((val) => !selectedpropositions.value.includes(val));
    deletepropositionsDialog.value = false;
    selectedpropositions.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'propositions Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

/* customized */

const appendOffreCommercialFile = (files) => {
    proposition.value.offre_commercial = files[0];
};
const appendOffreTechniqueFile = (files) => {
    proposition.value.offre_technique = files[0];
};
const saveProposition = () => {
    const formData = new FormData();
    proposition.value.demande_id = store.state.selectedDemande.id;
    proposition.value.gestionnaire_id = store.state.user.id;
    console.log(proposition.value);
    formData.append('intitule', proposition.value.intitule);
    formData.append('date_debut', TimeFormater.formatDate1(proposition.value.date_debut));
    formData.append('date_fin', TimeFormater.formatDate1(proposition.value.date_fin));
    formData.append('gestionnaire_id', proposition.value.gestionnaire_id);
    formData.append('format', proposition.value.format.name);
    formData.append('details', proposition.value.details);
    formData.append('demande_id', proposition.value.demande_id);
    formData.append('prix', proposition.value.prix);
    formData.append('offre_commercial', proposition.value.offre_commercial);
    formData.append('offre_technique', proposition.value.offre_technique);
    store
        .dispatch('saveProposition', formData)
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch((err) => {});
    proposition.value = {};

    propositionDialog.value = false;
};
const updateProposition = () => {
    proposition.value.format = typeof proposition.value.format == 'string' ? proposition.value.format : proposition.value.format.name;
    const formData = new FormData();
    formData.append('intitule', proposition.value.intitule);
    formData.append('date_debut', TimeFormater.formatDate1(proposition.value.date_debut));
    formData.append('date_fin', TimeFormater.formatDate1(proposition.value.date_fin));
    formData.append('gestionnaire_id', proposition.value.gestionnaire_id);
    formData.append('format', proposition.value.format);
    formData.append('details', proposition.value.details);
    formData.append('demande_id', proposition.value.demande_id);
    formData.append('prix', proposition.value.prix);
    formData.append('_method', 'PUT');

    store
        .dispatch('updateProposition', { propositionId: proposition.value.id, proposition: formData })
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch((err) => {});
};
const sendProposition = (proposition) => {
    store.dispatch('getPropsitionById', proposition.id);
    router.push('/step3');
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4" v-if="store.state.user.roles[0].name !== 'client'">
                    <template v-slot:end>
                        <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="propositions"
                    v-model:selection="selectedpropositions"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} propositions"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage propositions</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="id" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="entite" header="entite" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">entite</span>
                            {{ slotProps.data.demande.client.nom + ' ' + slotProps.data.demande.client.prenom + ' (' + slotProps.data.demande.client.entite + ')' }}
                        </template>
                    </Column>

                    <Column field="date_debut" header="Date debut" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date debut</span>
                            {{ TimeFormater.formatDate1(slotProps.data.date_debut) }}
                        </template>
                    </Column>
                    <Column field="date_fin" header="Date fin" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date fin</span>
                            {{ TimeFormater.formatDate1(slotProps.data.date_fin) }}
                        </template>
                    </Column>
                    <Column field="duree" header="duree" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">duree</span>
                            {{ slotProps.data.demande.duree }}
                        </template>
                    </Column>

                    <Column field="prix" header="prix" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">prix</span>
                            {{ slotProps.data.prix }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button v-if="store.state.user.roles[0].name !== 'client'" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editeProposition(slotProps.data)" />
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" @click="sendProposition(slotProps.data)" />
                            <Button v-if="store.state.user.roles[0].name !== 'client'" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="propositionDialog" :style="{ width: '450px' }" header="Proposition" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="entite">Intitule</label>
                        <InputText id="entite" v-model.trim="proposition.intitule" required="true" autofocus :class="{ 'p-invalid': submitted && !proposition.intitule }" />
                        <small class="p-invalid" v-if="submitted && !proposition.intitule">entite is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Détails de la proposition</label>
                        <Textarea id="description" v-model="proposition.details" required="true" rows="3" cols="20" />
                    </div>
                    <div class="field">
                        <!-- <label for="format">Format</label> -->
                        <Dropdown v-model="proposition.format" :options="dropdownValues" optionLabel="name" placeholder="Format" />
                    </div>
                    <div class="field">
                        <label for="description">Date de debut</label>
                        <Calendar :showIcon="true" v-model="proposition.date_debut" :showButtonBar="true"></Calendar>
                    </div>
                    <div class="field">
                        <label class="mb-3">Date de fin</label>
                        <Calendar :showIcon="true" v-model="proposition.date_fin" :showButtonBar="true"></Calendar>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="prix">prix</label>
                            <InputNumber id="prix" v-model="proposition.prix" :class="{ 'p-invalid': submitted && !proposition.prix }" :required="true" />
                            <small class="p-invalid" v-if="submitted && !proposition.prix">prix is required.</small>
                        </div>
                    </div>
                    <div class="formgrid grid" v-if="!proposition.id">
                        <div class="field col">
                            <label class="mb-12">Offre commercial: </label>
                            <div class="mb-12">
                                <input class="" type="file" name="contrat" @change="appendOffreCommercialFile($event.target.files)" id="" />
                            </div>
                        </div>
                    </div>
                    <div class="formgrid grid" v-if="!proposition.id">
                        <div class="field col">
                            <label class="mb-12">Offre technique: </label>
                            <div class="mb-12">
                                <input class="" type="file" name="contrat" @change="appendOffreTechniqueFile($event.target.files)" id="" />
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <div class="">
                            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                            <Button label="Save" icon="pi pi-check" class="p-button-text" v-if="!proposition.id" @click="saveProposition" />
                            <Button label="Update" icon="pi pi-check" class="p-button-text" v-if="proposition.id" @click="updateProposition" />
                        </div>
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletePropositionDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="proposition"
                            >Vous êtes sur, vous voulez supprimer la proposition: <b>{{ proposition.intitule }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePropositionDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletepropositionsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected propositions?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletepropositionsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedpropositions" />
                    </template>
                </Dialog>
            </div>
            <div class="card"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
