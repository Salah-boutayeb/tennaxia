<script setup>
import { useLayout } from '@/layout/composables/layout';

const { contextPath } = useLayout();
</script>

<template>
    <div class="card">
        <h3>Mission términée</h3>

        <div class="flex justify-content-center flex-wrap"><img :src="contextPath + 'demo/images/avatar/success.png'" alt="ddd" class="w-24rem h-24rem" /></div>
    </div>
</template>

<style></style>
