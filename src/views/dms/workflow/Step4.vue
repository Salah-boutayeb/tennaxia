<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import TimeFormater from '@/service/utils/TimeFormater';

import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import ParticipantTable from '@/components/ParticipantTable.vue';

import Contrat from '@/components/Contrat.vue';
import { useStore } from 'vuex';

import FactureView from '@/components/FactureView.vue';
import SessionActionsDialog from '@/components/SessionActionsDialog.vue';

import ParticipantDialog from '../../../components/ParticipantDialog.vue';
import FactureTable from '../../../components/FactureTable.vue';
import { useRouter } from 'vue-router';

const store = useStore();
const toast = useToast();
const { contextPath } = useLayout();
const router = useRouter();
const sessions = computed(() => store.state.sessions);
const sessionDialog = ref(false);
const sessionActionDialog = ref(false);

const deleteSessionDialog = ref(false);
const deleteSessionsDialog = ref(false);
const session = ref({});
const selectedsessions = ref(null);
const dt = ref(null);

const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    session.value = {};
    submitted.value = false;
    sessionDialog.value = true;
};
const openNewAction = () => {
    session.value = {};
    submitted.value = false;

    sessionActionDialog.value = true;
};
const hideDialog = () => {
    sessionDialog.value = false;
    sessionActionDialog.value = false;
    submitted.value = false;
};

const temp = ref({});
const editSession = (editSession) => {
    session.value = { ...editSession };
    temp.value = { ...editSession };

    sessionDialog.value = true;
    sessionActionDialog.value = true;
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

/* custome code for step 4 */

const appendConvocationFile = (files) => {
    session.value.convocation = files[0];
};
const saveSession = () => {
    const formData = new FormData();
    formData.append('date_debut', TimeFormater.formatDate(session.value.date_debut));
    formData.append('date_fin', TimeFormater.formatDate(session.value.date_fin));
    formData.append('duree', session.value.duree);
    formData.append('convocation', session.value.convocation);
    formData.append('etat', 'créée');
    formData.append('mission_id', store.state.selectedDemande.mission.id);
    formData.append('proposition_id', store.state.selectedProposition.id);
    formData.append('temps_debut', TimeFormater.formatDate2(session.value.temps_debut));
    formData.append('temps_fin', TimeFormater.formatDate2(session.value.temps_fin));

    store
        .dispatch('saveSessions', formData)
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch((err) => {});
    session.value = {};
    sessionDialog.value = false;
};
const updateSession = () => {
    const formData = new FormData();

    formData.append('date_debut', TimeFormater.formatDate(session.value.date_debut));
    formData.append('date_fin', TimeFormater.formatDate(session.value.date_fin));
    formData.append('duree', session.value.duree);
    // formData.append('convocation', session.value.convocation);
    formData.append('_method', 'PUT');
    // formData.append('mission_id', store.state.selectedDemande.mission.id);
    formData.append('temps_debut', TimeFormater.formatDate2(TimeFormater.formatDate3(session.value.temps_debut)));
    formData.append('temps_fin', TimeFormater.formatDate2(TimeFormater.formatDate3(session.value.temps_fin)));

    store
        .dispatch('updateSession', { session: formData, sessionId: session.value.id })
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch((err) => {});
    session.value = {};
    sessionDialog.value = false;
};
const confirmDeleteSession = (editSession) => {
    session.value = editSession;
    deleteSessionDialog.value = true;
};

const deleteSession = () => {
    store
        .dispatch('deleteSession', { sessionId: session.value.id })
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch(() => {});

    deleteSessionDialog.value = false;
    session.value = {};
};

const terminerMission = () => {
    const missionId = store.state.selectedMission.id;
    console.log('what', missionId);
    store
        .dispatch('terminerMission', { missionId })
        .then((response) => {
            // toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
            router.push('/step5');
        })
        .catch(() => {});
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <h3>Sessions</h3>

                <Toolbar class="mb-4" v-if="store.state.user.roles[0].name !== 'client'">
                    <template v-slot:end>
                        <Button label="Nouvelle session" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="sessions"
                    v-model:selection="selectedsessions"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Sessions</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <!-- <Column field="id" header="id"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column> -->

                    <Column field="date_debut" header="Date debut" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date debut</span>
                            {{ slotProps.data.date_debut + ' ' + slotProps.data.temps_debut }}
                        </template>
                    </Column>
                    <Column field="date_fin" header="Date fin" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date fin</span>
                            {{ slotProps.data.date_fin + ' ' + slotProps.data.temps_fin }}
                        </template>
                    </Column>
                    <Column field="duree" header="durée" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">duree</span>
                            {{ slotProps.data.duree }}
                        </template>
                    </Column>

                    <Column field="participant" header="prix" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <ParticipantTable :participants="data.participants" :sessionId="String(data.id)" />
                        </template>
                    </Column>
                    <Column field="statut" header="Statut" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-info'">{{ data.etat }}</span>
                        </template>
                    </Column>

                    <Column field="convocation" header="Convocation" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <a :href="data.documents[0].filepath" target="_blank" rel="noopener noreferrer">{{ data.documents[0].filename }}</a>
                        </template>
                    </Column>

                    <Column header="Action" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <SessionActionsDialog :session="data" />
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <ParticipantDialog :session="slotProps.data" />
                            <Button v-if="store.state.user.roles[0].name !== 'client'" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editSession(slotProps.data)" />
                            <Button v-if="store.state.user.roles[0].name !== 'client'" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteSession(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="sessionDialog" :style="{ width: '450px' }" header="session" :modal="true" class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="prix">Durée</label>
                            <InputNumber id="duree" v-model="session.duree" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="description">Date de debut</label>

                        <Calendar :showIcon="true" hourFormat="24" v-model="session.date_debut" :showButtonBar="true"></Calendar>
                    </div>
                    <div class="field">
                        <label for="description">Temps de debut</label>
                        <Calendar id="calendar-timeonly" v-model="session.temps_debut" timeOnly />
                    </div>
                    <div class="field">
                        <label class="mb-3">Date de fin</label>
                        <Calendar :showIcon="true" hourFormat="24" v-model="session.date_fin" :showButtonBar="true"></Calendar>
                    </div>
                    <div class="field">
                        <label for="description">Temps de fin</label>
                        <Calendar id="calendar-timeonly" v-model="session.temps_fin" timeOnly />
                    </div>
                    <div class="field" v-if="!session.documents">
                        <label class="mb-3">Documents de convocation</label>
                        <input type="file" @change="appendConvocationFile($event.target.files)" name="contrat" id="contart" />
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" v-if="!session.id" @click="saveSession" />
                        <Button label="update" icon="pi pi-check" class="p-button-text" v-if="session.id" @click="updateSession" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteSessionDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="session">Are you sure you want to delete this session?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteSessionDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSession" />
                    </template>
                </Dialog>
            </div>
            <div class="card">
                <Contrat />
            </div>
            <div class="card">
                <FactureView />
            </div>
            <div class="card flex flex-wrap align-items-center justify-content-center" v-if="store.state.user.roles[0].name !== 'client'">
                <Button label="Términer la mission" icon="pi pi-bookmark" iconPos="right" class="p-button-secondary mr-2 mb-2 w-16rem" @click="terminerMission()" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
