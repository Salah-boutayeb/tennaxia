<script setup>
import { toRefs } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    demandes: Array
});
const { demandes } = toRefs(props);
const formatDate = (value) => {
    return new Date(value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 'crée':
            return 'info';

        case 'traitée':
            return 'success';

        case 'en attente':
            return 'negociation';
    }
};
const getEtatSeverity = (status) => {
    switch (status) {
        case 'crée':
            return 'info';

        case 'traitée':
            return 'success';

        case 'en attente':
            return 'negociation';
    }
};
const viewDemande = (id) => {
    router.push(`/step1/${id}`);
};
</script>

<template>
    <div class="card" style="width: 100%">
        <h5>Demandes</h5>
        <DataTable :value="demandes" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column field="demandes" header="demande" style="width: 40%">
                <template #body="{ data }">
                    {{ data.intitule }}
                </template>
            </Column>
            <Column field="type" header="type" style="width: 25%">
                <template #body="{ data }">
                    <Tag :value="data.type" :severity="getEtatSeverity(data.type)" />
                </template>
            </Column>
            <Column field="createdAT" header="date de création" style="width: 25%">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>
            <Column field="etat" header="etat" style="width: 10%">
                <template #body="{ data }">
                    <Tag :value="data.etat" :severity="getStatusSeverity(data.etat)" />
                </template>
            </Column>
            <Column field="" header="" style="width: 10%">
                <template #body="{ data }">
                    <Button type="button" icon="pi pi-eye" rounded @click="viewDemande(data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style></style>
