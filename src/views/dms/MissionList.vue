<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { ref, onBeforeMount, computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useStore } from 'vuex';

const store = useStore();

const missions = computed(() => store.state.missions);
onBeforeMount(() => {
    store.dispatch('allMissions');
    console.log(process.env);
    store.commit('INIT_PROCESS');
});
const { contextPath } = useLayout();
const statuses = ref([
    { color: 'negotiation', status: 'En cours' },
    { color: 'renewal', status: 'cloturée' },
    { color: 'new', status: 'Envoyée' },
    { color: 'unqualified', status: 'refusée' },
    { color: 'qualified', status: 'validée' }
]);

const agents = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);

/* */
onBeforeMount(() => {
    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS, facture: { value: null, matchMode: FilterMatchMode.EQUALS } }
    };
};

const clearFilter1 = () => {
    initFilters1();
};
</script>

<template>
    <div className="grid">
        {{ missions }}
        <div className="col-12  ">
            <div className="card">
                <h5>Filter Menu</h5>
                <DataTable
                    :value="missions"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="10"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters1"
                    filterDisplay="menu"
                    :loading="loading1"
                    :filters="filters1"
                    responsiveLayout="scroll"
                    :globalFilterFields="['intitule', 'client', 'demandeur', 'status', 'facture']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()" />
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No missions found. </template>
                    <template #loading> Loading missions data. Please wait. </template>
                    <Column filterField="intitule" header="Intitule de la mission" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.demande.intitule }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="client" filterField="client" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span>{{ data.client.entite }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country" />
                        </template>
                    </Column>
                    <Column header="Agent" filterField="demandeur" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.client.nom + ' ' + data.client.prenom }}</span>
                        </template>
                    </Column>

                    <Column field="status" header="etat de la missions" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-' + data.status.status">{{ data.status.status }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{ slotProps.value }}</span>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.option">{{ slotProps.option }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column field="facture" header="Facturée" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.factures, 'text-pink-500 pi-times-circle': !data.factures }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <TriStateCheckbox v-model="filterModel.value" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style></style>
