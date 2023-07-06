<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import TimeFormater from '@/service/utils/TimeFormater';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const position = ref('center');
const visible = ref(false);

const openPosition = (pos) => {
    position.value = pos;
    visible.value = true;
};
const toast = useToast();
const store = useStore();
const message = ref(null);
const proposition = computed(() => store.state.selectedProposition);

const sendProposition = (proposition) => {
    store.dispatch('sendProposition', { propositionId: proposition.id, missionId: store.state.selectedDemande.mission.id });
};
const accepteProposition = (proposition) => {
    store
        .dispatch('acceptProposition', { propositionId: proposition.id, missionId: store.state.selectedDemande.mission.id, message: null })
        .then((response) => toast.add({ severity: 'success', summary: 'Successful', detail: response, life: 3000 }))
        .catch(() => {});
};

const refuserProposition = () => {
    store
        .dispatch('refuserProposition', { propositionId: proposition.value.id, missionId: store.state.selectedDemande.mission.id, message: message.value })
        .then((response) =>
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: response,
                life: 3000
            })
        )
        .catch(() => {});
    message.value = '';
};
</script>

<template>
    <div class="col-12">
        <div class="card">
            <h5>Proposition</h5>
            <div class="grid" v-if="proposition.id">
                <div class="col-12 md:col-5 lg:col-5">
                    <h6>Intitulé</h6>
                    <p class="line-height-3 m-0">
                        {{ proposition.intitule }}
                    </p>
                    <h6>Description</h6>
                    <p class="line-height-3 m-0">
                        {{ proposition.details }}
                    </p>
                    <Divider layout="horizontal" align="center">
                        <span class="p-tag">Détails</span>
                    </Divider>
                    <div class="grid">
                        <div class="col-12 md:col-6 lg:col-3"><h5>Format:</h5></div>
                        <div class="col-12 md:col-6 lg:col-9">
                            <Chip :label="proposition.format" class="mr-2 mb-2"></Chip>
                        </div>
                        <div class="col-12 md:col-6 lg:col-3">
                            <h6>Date de debut:</h6>
                        </div>
                        <div class="col-12 md:col-6 lg:col-3">
                            <p>{{ TimeFormater.formatDate(proposition.date_debut) }}</p>
                        </div>
                        <div class="col-12 md:col-6 lg:col-3">
                            <h6>Date de debut:</h6>
                        </div>
                        <div class="col-12 md:col-6 lg:col-3">
                            <p>{{ TimeFormater.formatDate(proposition.date_fin) }}</p>
                        </div>
                        <div class="col-12"><h5>Documents attachés:</h5></div>
                        <div class="col-12">
                            <div class="grid">
                                <div class="col-12" v-for="doc in proposition.documents" :key="doc.id">
                                    <span>{{ doc.ref.type }} : </span>
                                    <a :href="doc.filepath" target="_blank" rel="noopener noreferrer">{{ doc.filename }}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 md:col-2 lg:col-2">
                    <Divider layout="lg:vertical horizontal "> </Divider>
                </div>
                <div class="col-12 md:col-5 lg:col-5 align-items-center justify-content-center">
                    <div class="grid">
                        <div class="col">
                            <h6>Nom:</h6>
                            <p>{{ proposition.gestionnaire.nom }}</p>
                            <p>{{ proposition.gestionnaire.prenom }}</p>
                            <h6>Role:</h6>
                            <p>Gestionnaire</p>
                        </div>
                        <div class="col">
                            <h6>Email:</h6>
                            <p>{{ proposition.gestionnaire.email }}</p>
                            <h6>Télé:</h6>
                            <p>{{ proposition.gestionnaire.telephone }}</p>
                        </div>
                    </div>

                    <Divider layout="horizontal" align="center"> </Divider>
                    <div class="grid">
                        <div class="col-3"><h5>Status:</h5></div>
                        <div class="col-9"><Tag class="mr-2" severity="info" :value="proposition.etat"></Tag></div>

                        <div class="col-3"><h5>Prix:</h5></div>
                        <div class="col-9">
                            <p>{{ proposition.prix }} DHS TTC</p>
                        </div>
                    </div>
                    <div class="grid">
                        <Fieldset :legend="'commentaires (' + proposition.commentaires.length + ')'" :toggleable="true" :style="{ width: '340px' }" v-if="proposition.commentaires">
                            <div v-for="commentaire in proposition.commentaires" :key="commentaire.id">
                                <span
                                    ><b>{{ TimeFormater.formatDate1(commentaire.created_at) }} :</b></span
                                >
                                <p class="line-height-3 m-0">
                                    {{ commentaire.message }}
                                </p>
                            </div>
                        </Fieldset>
                    </div>
                </div>
            </div>

            <div class="flex justify-content-center flex-wrap">
                <Button v-if="store.state.user.roles[0].name !== 'client'" label="envoyer" :disabled="proposition.is_sent" icon="pi pi-send" @click="sendProposition(proposition)" iconPos="right" class="mr-2 mb-2"></Button>
                <Button label="accepte" :disabled="!proposition.is_sent" icon="pi pi-check" @click="accepteProposition(proposition)" iconPos="right" class="mr-2 mb-2 p-button-info"></Button>
                <Button label="refuser" :disabled="!proposition.is_sent" icon="pi pi-times" @click="openPosition('top')" iconPos="right" class="mr-2 mb-2 p-button-danger"></Button>
                <!-- <Button label="Top" icon="pi pi-arrow-down" @click="openPosition('top')" severity="warning" style="min-width: 10rem" /> -->
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visible" header="Header" :style="{ width: '50vw' }" :position="position" :modal="true" :draggable="false">
        <span class="p-float-label">
            <Textarea v-model="message" rows="5" :style="{ width: '47vw' }" />
            <label>message</label>
        </span>
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="visible = false" text />
            <Button label="envoyer" icon="pi pi-check" @click="refuserProposition" autofocus />
        </template>
    </Dialog>
</template>

<style></style>
