<script setup>
import { ref, onMounted, computed } from 'vue';
import TimeFormater from '@/service/utils/TimeFormater';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();
const submitted = ref(false);
const items = ref([]);
const competances = ref([]);
const demande = ref({});
const search = (event) => {
    items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
};
const autoValue = ref(null);

const autoFilteredValue = ref([]);
const calendarValue = ref(null);

const clients = computed(() => store.state.clients);
const dropdownValue = ref(null);
onMounted(() => {
    store.dispatch('allClients');
});

const searchCountry = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
const splitCompetences = (text) => {
    competances.value = text ? text.split(',') : [];
};
/* customized */
splitCompetences(demande.value.domaines_competences);
const appendFile = (files) => {
    demande.value.file = files[0];
};

const checkAllField = () => {
    submitted.value = true;
    if (
        demande.value.client &&
        demande.value.file &&
        demande.value.intitule &&
        demande.value.adresse &&
        demande.value.budget &&
        demande.value.date_debut &&
        demande.value.date_fin &&
        demande.value.domaines_competences &&
        demande.value.gestionnaire_id &&
        demande.value.type &&
        demande.value.objectif &&
        demande.value.duree &&
        demande.value.profils_participants &&
        demande.value.nbr_participants
    ) {
        return true;
    }
    return false;
};

const save = () => {
    if (checkAllField()) {
        let formData = new FormData();
        const userId = demande.value.client ? demande.value.client.id : store.state.user.id;
        formData.append('file', demande.value.file);
        formData.append('intitule', demande.value.intitule);
        formData.append('adresse', demande.value.adresse);
        formData.append('budget', demande.value.budget);
        formData.append('client_id', userId);
        formData.append('date_debut', TimeFormater.formatDate(demande.value.date_debut));
        formData.append('date_fin', TimeFormater.formatDate(demande.value.date_fin));
        formData.append('domaines_competences', demande.value.domaines_competences);
        formData.append('gestionnaire_id', demande.value.gestionnaire_id);
        formData.append('type', demande.value.type);
        formData.append('objectif', demande.value.objectif);
        formData.append('duree', demande.value.duree);
        formData.append('profils_participants', demande.value.profils_participants);
        formData.append('nbr_participants', demande.value.nbr_participants);
        demande.value = {};
        store
            .dispatch('saveDemande', formData)
            .then((response) => {
                router.push(`/step1/${response.id}`);
                submitted.value = true;
            })
            .catch(() => {});
    }
};

/*  */
</script>

<template>
    <div className="grid">
        <div className="col-12">
            <div class="card p-fluid">
                <h3>Demande</h3>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0">Intitulé</label>
                    <div class="col-12 md:col-8">
                        <InputText id="name3" type="text" required="true" v-model="demande.intitule" :class="{ 'p-invalid': submitted && !demande.intitule }" />
                        <small class="p-error" v-if="submitted && !demande.intitule">This field is required.</small>
                    </div>
                </div>
                <div class="field grid">
                    <label for="email3" class="col-12 mb-2 md:col-4 md:mb-0">Type</label>
                    <div class="col-12 md:col-8">
                        <InputText id="email3" type="text" required="true" v-model="demande.type" :class="{ 'p-invalid': submitted && !demande.type }" />
                        <small class="p-error" v-if="submitted && !demande.type">This field is required.</small>
                    </div>
                </div>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0">Début de la formation</label>
                    <div class="col-12 md:col-8">
                        <Calendar :showIcon="true" :showButtonBar="true" required="true" v-model="demande.date_debut" :class="{ 'p-invalid': submitted && !demande.date_debut }"></Calendar>
                        <small class="p-error" v-if="submitted && !demande.date_debut">This field is required.</small>
                    </div>
                </div>
                <div class="field grid">
                    <label for="email3" class="col-12 mb-2 md:col-4 md:mb-0">Fin de la formation</label>
                    <div class="col-12 md:col-8">
                        <Calendar :showIcon="true" :showButtonBar="true" required="true" v-model="demande.date_fin" :class="{ 'p-invalid': submitted && !demande.date_fin }"></Calendar>
                        <small class="p-error" v-if="submitted && !demande.date_fin">This field is required.</small>
                    </div>
                </div>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0">Domaines de compétences</label>
                    <div class="col-12 md:col-8">
                        <InputText type="text" name="domaines_competences" required="true" v-model="demande.domaines_competences" :class="{ 'p-invalid': submitted && !demande.domaines_competences }" />
                        <small class="p-error" v-if="submitted && !demande.domaines_competences">This field is required.</small>
                    </div>
                </div>
                <div class="field grid" v-if="store.state.user.roles[0].name !== 'client'">
                    <label for="email3" class="col-12 mb-2 md:col-4 md:mb-0">Commanditaire mission</label>
                    <div class="col-12 md:col-8">
                        <Dropdown v-model="demande.client" :options="clients" required="true" optionLabel="nomComplet" placeholder="Choisissez le commanditaire" :class="{ 'p-invalid': submitted && !demande.client }" />
                        <small class="p-error" v-if="submitted && !demande.client">This field is required.</small>
                    </div>
                </div>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0">Documents</label>
                    <div class="col-12 md:col-8">
                        <input type="file" name="contrat" required="true" @change="appendFile($event.target.files)" id="contart" :class="{ 'p-invalid': submitted && !demande.file }" />
                        <small class="p-error" v-if="submitted && !demande.file">This field is required.</small>
                    </div>
                </div>

                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-4">
                        <label for="firstname2">Durée :</label>
                        <InputText id="firstname2" required="true" type="text" v-model="demande.duree" :class="{ 'p-invalid': submitted && !demande.duree }" />
                        <small class="p-error" v-if="submitted && !demande.duree">This field is required.</small>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="lastname2">Budget :</label>
                        <InputText id="lastname2" required="true" type="text" v-model="demande.budget" :class="{ 'p-invalid': submitted && !demande.budget }" />
                        <small class="p-error" v-if="submitted && !demande.budget">This field is required.</small>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="lastname2">Nombre de participants :</label>
                        <InputText id="lastname2" required="true" type="text" v-model="demande.nbr_participants" :class="{ 'p-invalid': submitted && !demande.nbr_participants }" />
                        <small class="p-error" v-if="submitted && !demande.nbr_participants">This field is required.</small>
                    </div>

                    <div class="field col-12">
                        <label for="address">Profil </label>
                        <Textarea id="address" required="true" rows="4" v-model="demande.profils_participants" :class="{ 'p-invalid': submitted && !demande.profils_participants }" />
                        <small class="p-error" v-if="submitted && !demande.profils_participants">This field is required.</small>
                    </div>
                    <div class="field col-12">
                        <label for="address">Objectif</label>
                        <Textarea id="address" required="true" rows="4" v-model="demande.objectif" :class="{ 'p-invalid': submitted && !demande.objectif }" />
                        <small class="p-error" v-if="submitted && !demande.objectif">This field is required.</small>
                    </div>
                    <div class="field col-12">
                        <label for="city">L'adresse</label>
                        <InputText id="city" required="true" type="text" v-model="demande.adresse" :class="{ 'p-invalid': submitted && !demande.adresse }" />
                        <small class="p-error" v-if="submitted && !demande.adresse">This field is required.</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
