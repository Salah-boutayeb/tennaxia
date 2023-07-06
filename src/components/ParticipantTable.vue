<script setup>
import { useToast } from 'primevue/usetoast';
import { ref, toRefs } from 'vue';
import { useStore } from 'vuex';

const toast = useToast();
const store = useStore();
const props = defineProps({
    participants: Array,
    sessionId: String
});

const { participants, sessionId } = toRefs(props);
const deleteParticipant = (id) => {
    store
        .dispatch('deleteParticipant', { participantId: id, sessionId: sessionId.value })
        .then((response) => {
            if (response.success) {
                participants.value = participants.value.filter((participant) => participant.id !== id);

                toast.add({ severity: 'warning', summary: 'Success', detail: response.message, life: 3000 });
            } else {
                toast.add({ severity: 'warning', summary: 'Success', detail: "participant n'est pas suprimé!", life: 3000 });
            }
        })
        .catch();
};
const dialogVisible = ref(false);

const editingRows = ref([]);
const onRowEditSave = (event) => {
    let { newData, index } = event;
    store
        .dispatch('updateParticipant', { participant: newData })
        .then((response) => {
            if (response.success) {
                // participants.value[index] = newData;

                toast.add({ severity: 'warning', summary: 'Success', detail: response.message, life: 3000 });
            } else {
                toast.add({ severity: 'warning', summary: 'Success', detail: "participant n'est pas suprimé!", life: 3000 });
            }
        })
        .catch();
};
</script>

<template>
    <div class="">
        <Button :label="participants.length + ' participants'" icon="pi pi-external-link" @click="dialogVisible = true" />

        <Dialog v-model:visible="dialogVisible" header="Flex Scroll" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
            <DataTable :value="participants" v-model:editingRows="editingRows" paginator :scrollable="true" :rows="4" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" tableClass="editable-cells-table">
                <Column field="nom" header="nom">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" />
                    </template>
                </Column>
                <Column field="prenom" header="prenom">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" />
                    </template>
                </Column>
                <Column field="email" header="email">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" />
                    </template>
                </Column>
                <Column field="certif" header="certif">
                    <template #body="{ data, field }">
                        <a v-if="data[field]" :href="data[field].filepath" target="_blank" rel="noopener noreferrer">{{ data[field].filename }}</a>
                        <p v-if="!data[field]">no certif yet!</p>
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 5%; min-width: 0.5rem" bodyStyle="text-align:center"></Column>

                <Column header="delete">
                    <template #body="{ data }">
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mr-2" @click="deleteParticipant(data.id)" />
                    </template>
                </Column>
            </DataTable>
            <template #footer>
                <Button label="Ok" icon="pi pi-check" @click="dialogVisible = false" />
            </template>
        </Dialog>
    </div>
</template>
