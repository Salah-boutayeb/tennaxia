<script setup>
import { ref, onMounted } from 'vue';

const value = ref('');
const items = ref([]);

const search = (event) => {
    items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
};
const autoValue = ref(null);

const autoFilteredValue = ref([]);

const dropdownValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const dropdownValue = ref(null);

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
</script>

<template>
    <div className="grid">
        <div className="col-12">
            <div class="card p-fluid">
                <h3>Demande</h3>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0">Intitulé</label>
                    <div class="col-12 md:col-8">
                        <p>Lorem, ipsum</p>
                    </div>
                </div>
                <div class="field grid">
                    <label for="email3" class="col-12 mb-2 md:col-4 md:mb-0">Type</label>
                    <div class="col-12 md:col-8">
                        <p>intra</p>
                    </div>
                </div>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0"> Début de la formation</label>
                    <div class="col-12 md:col-8">3/30/2023</div>
                </div>
                <div class="field grid">
                    <label for="email3" class="col-12 mb-2 md:col-4 md:mb-0">Fin de la formation</label>
                    <div class="col-12 md:col-8">4/13/2023</div>
                </div>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0">Domaines de compétences</label>
                    <div class="col-12 md:col-8">
                        <div class="flex align-items-center flex-column sm:flex-row">
                            <Chip label="Action" class="mr-2 mb-2"></Chip>
                            <Chip label="Comedy" class="mr-2 mb-2"></Chip>
                            <Chip label="Mystery" class="mr-2 mb-2"></Chip>
                        </div>
                    </div>
                </div>
                <div class="field grid">
                    <label for="email3" class="col-12 mb-2 md:col-4 md:mb-0">Commanditaire mission</label>
                    <div class="col-12 md:col-8">
                        <p>Boutayeb Salah Eddine</p>
                    </div>
                </div>
                <div class="field grid">
                    <label for="name3" class="col-12 mb-2 md:col-4 md:mb-0">Documents</label>
                    <div class="col-12 md:col-8">
                        <div class="flex justify-content-evenly flex-wrap">
                            <div class="flex align-items-start justify-content-start"><a href="http://" target="_blank" rel="noopener noreferrer">doc1.pdf</a></div>
                            <div class="flex align-items-start justify-content-start"><a href="http://" target="_blank" rel="noopener noreferrer">doc2.pdf</a></div>
                            <div class="flex align-items-start justify-content-start"><a href="http://" target="_blank" rel="noopener noreferrer">doc2.pdf</a></div>
                        </div>
                    </div>
                </div>

                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-4">
                        <label for="firstname2">Durée :</label>
                        <p>5 jours</p>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="lastname2">Budget :</label>
                        <p>1200 DHS</p>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="lastname2">Nombre de participants :</label>
                        <p>14</p>
                    </div>

                    <div class="field col-12">
                        <label for="address">Profil </label>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi saepe ea mollitia, pariatur voluptas architecto harum ipsa voluptate, iusto facere reprehenderit soluta excepturi dolorem placeat nihil repellat quidem
                            molestiae corrupti doloremque, asperiores itaque. Obcaecati.
                        </p>
                    </div>
                    <div class="field col-12">
                        <label for="address">Objectif</label>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas laboriosam quas, quidem dolore porro quae ipsam placeat nemo, voluptatem itaque dolorem ea dolores, laborum autem alias non sequi quisquam nostrum
                            accusantium commodi. Delectus, at?
                        </p>
                    </div>
                    <div class="field col-12">
                        <label for="city">L'adresse</label>
                        <p>11, Eljadida LOT Mouilha, Maroc</p>
                    </div>
                </div>
                <div class="field grid">
                    <div for="name3" class="col-3">
                        <Button label="éditer" icon="" iconPos="right" class="p-button-primary mr-2 mb-2" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
