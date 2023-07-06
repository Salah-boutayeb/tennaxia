<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { utils, read } from 'xlsx';

const toast = useToast();
const store = useStore();
const props = defineProps({
    session: {}
});
const { session } = toRefs(props);

const position = ref('center');
const visible = ref(false);
const mission = computed(() => store.state.selectedMission);

const openPosition = (pos) => {
    position.value = pos;
    visible.value = true;
};
const file = ref();
const fileToUpload = ref({});
/* actions */
const readCsv = (event) => {
    const reader = new FileReader();
    console.log(session.value);
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const participants = utils.sheet_to_json(worksheet, { header: 1 }).map((participant) => {
            return { nom: participant[0], prenom: participant[1], email: participant[2], session_id: session.value.id };
        });
        store
            .dispatch('saveParticipants', { participants: participants, sessionId: session.value.id })
            .then((response) => {
                toast.add({ severity: 'info', summary: 'Success', detail: response, life: 3000 });
            })
            .catch();

        event.target.value = '';
        // Process the data as needed
    };

    reader.readAsArrayBuffer(file.value.files[0]);
};

const uploadMissionFiles = (event) => {
    fileToUpload.value.name = event.target.name;
    fileToUpload.value.data = event.target.files[0];
    const missionId = mission.value.id;
    store
        .dispatch('uploadMissionFiles', { file: fileToUpload.value, missionId })
        .then((response) => {})
        .catch((err) => {});

    event.target.value = '';
};

const changerEtatSession = (id, etat) => {
    const formData = new FormData();
    formData.append('etat', etat);
    formData.append('_method', 'PUT');
    store
        .dispatch('updateSession', { session: formData, sessionId: id })
        .then((response) => {})
        .catch((err) => {});
};

const convoquer = () => {
    console.log(session.value);
    store.dispatch('ConvoquerSessionParticipants', { sessionId: session.value.id });
};
const certifGeneration = () => {
    store
        .dispatch('certifGeneration', { sessionId: session.value.id })
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch(() => {});
};
const emargementGeneration = () => {
    store
        .dispatch('emargementGeneration', { sessionId: session.value.id })
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 });
        })
        .catch(() => {});
};
</script>

<template>
    <div class="flex flex-wrap justify-content-center gap-2 mb-2">
        <Button label="action" icon="pi pi-angle-double-left" @click="openPosition('topright')" severity="warning" style="min-width: 10rem" />
    </div>

    <Dialog v-model:visible="visible" :style="{ width: '470px' }" header="session" :modal="true" class="p-fluid">
        <div class="formgrid grid">
            <div class="field col" v-if="!mission.emargement">
                <label for="prix">Charger les documents (émargements)</label>
                <input type="file" name="emargement" id="emargement" @change="uploadMissionFiles($event)" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col" v-if="!mission.evaluation">
                <label for="prix">Charger les documents (évaluations)</label>
                <input type="file" name="evaluation" id="evaluation" @change="uploadMissionFiles($event)" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="prix">Charger les documents (cértifications)</label>
                <input type="file" name="certif" id="certif" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="prix">Charger les partcipants (excel)</label>

                <input type="file" name="partcipants" id="partcipants" ref="file" @change="readCsv($event)" />
            </div>
        </div>
        <div class="" v-if="store.state.user.roles[0].name !== 'client'">
            <div class="field">
                <a :href="'http://localhost:8000/api/emargement/session/' + session.id" target="_blank" rel="noopener noreferrer">
                    <Button label="générer fiche d'émargement" icon="pi pi-send" iconPos="right" class="mr-2 mb-2"></Button>
                </a>
            </div>
            <div class="field">
                <Button label="Envoyer la convocation" icon="pi pi-send" iconPos="right" class="mr-2 mb-2" @click="convoquer"></Button>
            </div>
            <div class="field">
                <Button label="Passer à l'état réalisée" icon="pi pi-calendar-plus" iconPos="right" class="bg-cyan-500 hover:bg-cyan-400 mr-2 mb-2" @click="changerEtatSession(session.id, 'réalisée')"></Button>
            </div>
            <div class="field">
                <Button label="génerer des certifs aux participants" icon="pi pi-calendar-plus" iconPos="right" class="bg-cyan-500 hover:bg-cyan-400 mr-2 mb-2" @click="certifGeneration()"></Button>
            </div>

            <div class="field">
                <Button label="Reportée" icon="pi pi-calendar-times" iconPos="right" class="mr-2 mb-2 bg-red-600 hover:bg-red-400" @click="changerEtatSession(session.id, 'reportée')"></Button>
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="visible = false" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="visible = false" />
        </template>
    </Dialog>
</template>
