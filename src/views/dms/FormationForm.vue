<script setup>
import { ref } from 'vue';

const floatValue = ref(null);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const calendarValue = ref(null);
const inputNumberValue = ref(null);
const chipsValue = ref(null);
const sliderValue = ref(50);
const ratingValue = ref(null);
const colorValue = ref('#1976D2');
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const listboxValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const listboxValue = ref(null);
const dropdownValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

const agents = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const searchCountry = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...agents.value];
        } else {
            autoFilteredValue.value = agents.value.filter((agent) => {
                return agent.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
</script>
<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <span class="p-float-label mt-5 pt-3">
                    <InputText id="username" type="text" v-model="floatValue" />
                    <label for="username">intitulé de la formation</label>
                </span>
                <h5>objectif</h5>
                <Textarea placeholder="objectif de la formation" :autoResize="true" rows="3" cols="30" />

                <h5>Client</h5>
                <AutoComplete placeholder="cherche un client" id="dd" :dropdown="true" :multiple="true" v-model="selectedAutoValue" :suggestions="autoFilteredValue" @complete="searchCountry($event)" field="name" />

                <h5>la date du formation</h5>
                <Calendar :showIcon="true" :showButtonBar="true" v-model="calendarValue"></Calendar>

                <h5>le nombre de participants</h5>
                <InputNumber v-model="inputNumberValue" showButtons mode="decimal"></InputNumber>
                <span class="p-float-label mt-5 pt-3">
                    <InputText id="lieu" type="text" v-model="floatValue" />
                    <label for="lieu">lieu de la formation</label>
                </span>
            </div>
        </div>
    </div>
</template>
