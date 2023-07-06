<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const toast = useToast();

const user = ref({});

const position = ref('center');
const visible = ref(false);

const openPosition = (pos) => {
    position.value = pos;
    visible.value = true;
};

/* actions */
function generatePass() {
    let password = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz-_@ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 8;
    for (var i = 0; i <= passwordLength; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    user.value.password = password;
}
function addClient() {
    const formData = new FormData();
    formData.append('nom', user.value.nom);
    formData.append('prenom', user.value.prenom);
    formData.append('entite', user.value.entite);
    formData.append('email', user.value.email);
    formData.append('adresse', user.value.adresse);
    formData.append('password', user.value.password);
    user.value = {};
    store
        .dispatch('addClient', { user: formData })
        .then((result) => {
            toast.add({ severity: 'success', summary: 'Success Message', detail: result, life: 3000 });
        })
        .catch((err) => {
            toast.add({ severity: 'warn', summary: 'Success Message', detail: err, life: 3000 });
        });
}
</script>

<template>
    <div class="flex flex-wrap justify-content-center gap-2 mb-2">
        <Button label="Ajouter client" icon="pi pi-user" @click="openPosition('topright')" severity="warning" style="min-width: 10rem" />
    </div>
    <Toast />
    <Dialog v-model:visible="visible" :style="{ width: '430px' }" header="session" :modal="true" class="p-fluid">
        <div class="formgrid grid">
            <div class="field col">
                <label for="nom">Nom</label>
                <InputText id="nom" type="text" v-model="user.nom" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="prenom">Prenom</label>
                <InputText id="prenom" type="text" v-model="user.prenom" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="entite">Entite</label>
                <InputText id="entite" type="text" v-model="user.entite" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="adresse">Adresse</label>
                <InputText id="adresse" type="text" v-model="user.adresse" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="email">Email</label>
                <InputText id="email" type="text" v-model="user.email" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <div class="p-inputgroup">
                    <Button label="generate" @click="generatePass" />
                    <InputText placeholder="Password" v-model="user.password" />
                </div>
                <!-- <Password id="password1" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password> -->
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="visible = false" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="addClient" />
        </template>
    </Dialog>
</template>
