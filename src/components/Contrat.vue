<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const toast = useToast();
const convention = computed(() => store.state.selectedMission.convention);
const contrat = computed(() => store.state.selectedMission.contrat);
const emargement = computed(() => store.state.selectedMission.emargement);
const evaluation = computed(() => store.state.selectedMission.evaluation);
const mission = computed(() => store.state.selectedMission);

const fileToUpload = ref({});
const uploadMissionFiles = (event) => {
    fileToUpload.value.name = event.target.name;
    fileToUpload.value.data = event.target.files[0];
    const missionId = mission.value.id;
    store
        .dispatch('uploadMissionFiles', { file: fileToUpload.value, missionId })
        .then((response) => {
            toast.add({ severity: 'info', summary: 'Success', detail: response, life: 3000 });
        })
        .catch(() => {});

    event.target.value = '';
};
const deleteMissionFile = (file) => {
    store
        .dispatch('deleteMissionFile', { file })
        .then((response) => {
            toast.add({ severity: 'info', summary: 'Success', detail: response, life: 3000 });
        })
        .catch(() => {});
};
</script>

<template>
    <Toast />
    <h3>Documents</h3>
    <div class="grid">
        <div class="col-12 md:col-6">
            <div class="field grid">
                <div class="col-12 md:col-7">
                    <div class="flex justify-content-between flex-wrap">
                        <div class="flex-initial flex align-items-center justify-content-center"><p class="text-xl font-medium">Convention Client:</p></div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="convention">
                            <a :href="convention.filepath" class="">{{ convention.filename }}</a>
                        </div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="convention"><Button icon="pi pi-trash" @click="deleteMissionFile(convention)" class="p-button-rounded p-button-warning p-button-text" /></div>
                        <div class="flex-initial flex align-items-center justify-content-center">
                            <input type="file" name="convention" id="convention" v-if="!convention" @change="uploadMissionFiles($event)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6" v-if="store.state.user.roles[0].name !== 'client'">
            <div class="field grid">
                <div class="col-12 md:col-7">
                    <div class="flex justify-content-between flex-wrap">
                        <div class="flex-initial flex align-items-center justify-content-center"><p class="text-xl font-medium">Contrat fournisseur:</p></div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="contrat">
                            <a :href="contrat.filepath" class="">{{ contrat.filename }}</a>
                        </div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="contrat"><Button icon="pi pi-trash" @click="deleteMissionFile(contrat)" class="p-button-rounded p-button-warning p-button-text" /></div>
                        <div class="flex-initial flex align-items-center justify-content-center">
                            <input type="file" name="contrat" id="contart" v-if="!contrat" @change="uploadMissionFiles($event)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="field grid">
                <div class="col-12 md:col-7">
                    <div class="flex justify-content-between flex-wrap">
                        <div class="flex-initial flex align-items-center justify-content-center"><p class="text-xl font-medium">fiche d'emargement:</p></div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="emargement">
                            <a :href="emargement.filepath" class="">{{ emargement.filename }}</a>
                        </div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="emargement"><Button icon="pi pi-trash" @click="deleteMissionFile(emargement)" class="p-button-rounded p-button-warning p-button-text" /></div>
                        <div class="flex-initial flex align-items-center justify-content-center">
                            <input type="file" name="emargement" id="emargement" v-if="!emargement" @change="uploadMissionFiles($event)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="field grid">
                <div class="col-12 md:col-7">
                    <div class="flex justify-content-between flex-wrap">
                        <div class="flex-initial flex align-items-center justify-content-center"><p class="text-xl font-medium">Fiche d'evaluation:</p></div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="evaluation">
                            <a :href="evaluation.filepath" class="">{{ evaluation.filename }}</a>
                        </div>
                        <div class="flex-initial flex align-items-center justify-content-center" v-if="evaluation"><Button icon="pi pi-trash" @click="deleteMissionFile(evaluation)" class="p-button-rounded p-button-warning p-button-text" /></div>
                        <div class="flex-initial flex align-items-center justify-content-center">
                            <input type="file" name="evaluation" id="evaluation" v-if="!evaluation" @change="uploadMissionFiles($event)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
