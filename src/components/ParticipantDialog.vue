<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

const toast = useToast();
const store = useStore();
const props = defineProps({
    session: {}
});
const { session } = toRefs(props);
const participant = ref({});
const position = ref('center');
const visible = ref(false);

const openPosition = (pos) => {
    position.value = pos;
    visible.value = true;
};

const saveParticipant = () => {
    participant.value.sessionId = session.value.id;

    store
        .dispatch('saveParticipant', { participant: participant.value })
        .then((response) => {
            toast.add({ severity: 'warning', summary: 'Success', detail: response, life: 3000 });
        })
        .catch();
    participant.value = {};
};
</script>

<template>
    <div class="flex flex-wrap justify-content-center gap-2 mb-2">
        <Button icon="pi pi-users" class="p-button-rounded p-button-secondary mr-2" @click="openPosition('topright')" />
    </div>

    <Dialog v-model:visible="visible" :style="{ width: '400px' }" header="Ajouter Particpant" :modal="true" class="p-fluid">
        <div class="formgrid grid">
            <div class="field col">
                <label for="prix">Nom:</label>
                <InputText name="emargement" id="emargement" v-model="participant.nom" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="prix">Prenom:</label>
                <InputText name="prenom" id="prenom" v-model="participant.prenom" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="prix">Email</label>
                <InputText name="email" id="email" v-model="participant.email" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="visible = false" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveParticipant()" />
        </template>
    </Dialog>
</template>
