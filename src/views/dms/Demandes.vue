<template>
    <Demandes :demandes="demandes" />
</template>

<script setup>
import Demandes from '@/components/Demandes.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const demandes = computed(() => store.state.demandes);
onMounted(() => {
    store.dispatch('allDemandes');
    store.commit('INIT_PROCESS');
});
</script>

<style></style>
