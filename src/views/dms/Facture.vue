<script setup>
import { onMounted } from 'vue';

import FactureTable from '../../components/FactureTable.vue';

const getSeverity = (status) => {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warning';

        case 'renewal':
            return null;
    }
};
</script>

<template>
    <div class="card">
        <FactureTable />
    </div>
</template>
