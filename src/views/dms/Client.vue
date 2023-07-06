<script setup>
import { FilterMatchMode } from 'primevue/api';
import ClientForm from '@/components/ClientForm.vue';
import { ref, onBeforeMount, computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useStore } from 'vuex';
import TimeFormater from '@/service/utils/TimeFormater';
const store = useStore();
const { contextPath } = useLayout();

const clients = computed(() => store.state.clients);

const filters1 = ref(null);
const loading1 = ref(null);

onBeforeMount(() => {
    store.dispatch('allClients');

    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        // name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        // 'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        // representative: { value: null, matchMode: FilterMatchMode.IN },
        // createdAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        // balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        // status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        // activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <Toast />
            <div class="card">
                <h5>Filter Menu</h5>

                <DataTable
                    :value="clients"
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
                    :globalFilterFields="['client', 'nbr_demandes', 'agent', 'ca', 'createdAt', 'lieu']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()" />
                            <ClientForm />
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="client" header="Nom de client" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.entite }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="nombre de demande" filterField="nbr_demande" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.nbr_demandes }}</span>
                        </template>
                    </Column>
                    <Column header="Agent responsable" filterField="agent" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text" v-tooltip="data.email">{{ data.nom + ' ' + data.prenom }}</span>
                        </template>
                    </Column>
                    <Column header="CA" filterField="ca" dataType="numeric" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.ca ? data.ca : 'C-A' }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>
                    <Column header="Date de création" filterField="createdAt" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ TimeFormater.formatDate(data.created_at) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column field="Lieu" header="lieu de client" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span>{{ data.adresse }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by place" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
