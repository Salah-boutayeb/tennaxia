<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const menu = ref(null);
const contextMenu = ref(null);

const nestedRouteItems = computed(() => store.state.processStat);
</script>

<template>
    <div class="card">
        <Steps :model="nestedRouteItems" :readonly="false" />
    </div>

    <router-view />
</template>
