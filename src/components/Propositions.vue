<script setup>
import { toRefs } from 'vue';

import { useStore } from 'vuex';
const store = useStore();
const props = defineProps({
    propositions: Array,
    propositionDialog: Boolean,
    deletepropositionsDialog: Boolean,
    deletePropositionDialog: Boolean
});
const { propositions } = toRefs(props);
</script>

<template>
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
                {{ slotProps.data.client.nom }}
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
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editeProposition(slotProps.data)" />
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="sendProposition(slotProps.data.id)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
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
        <div class="formgrid grid">
            <div class="field col">
                <label class="mb-12">Offre commercial: </label>
                <div class="mb-12">
                    <input class="" type="file" name="contrat" @change="appendOffreCommercialFile($event.target.files)" id="" />
                </div>
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label class="mb-12">Offre technique: </label>
                <div class="mb-12">
                    <input class="" type="file" name="contrat" @change="appendOffreTechniqueFile($event.target.files)" id="" />
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProposition" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deletePropositionDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product"
                >Are you sure you want to delete <b>{{ proposition.entite }}</b
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
</template>

<style></style>
