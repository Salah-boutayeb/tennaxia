<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';

import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
const { contextPath } = useLayout();

// formateur data
const formateurs = ref([]);
const formateurDialog = ref(false);
const deleteFormateurDialog = ref(false);
const deleteFormateursDialog = ref(false);
const formateur = ref({});
const selectedformateurs = ref(null);
const f_dt = ref(null);
const f_filters = ref({});
const f_submitted = ref(false);

const saveformateur = () => {
    f_submitted.value = true;
    if (formateur.value.nom && formateur.value.nom.trim()) {
        if (formateur.value.id) {
            formateurs.value[findIndexById(formateur.value.id)] = formateur.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            formateur.value.id = createId();
            formateurs.value.push(formateur.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        formateurDialog.value = false;
        formateur.value = {};
    }
};

const editFormateur = (editFormateur) => {
    formateur.value = { ...editFormateur };
    console.log(formateur);
    formateurDialog.value = true;
};

const confirmDeleteFormateur = (editProduct) => {
    formateur.value = editProduct;
    deleteFormateurDialog.value = true;
};

const deleteFormateur = () => {
    formateurs.value = formateurs.value.filter((val) => val.id !== formateur.value.id);
    deleteFormateurDialog.value = false;
    formateur.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'formateur Deleted', life: 3000 });
};

const deleteSelectedFormateur = () => {
    formateurs.value = formateurs.value.filter((val) => !selectedformateurs.value.includes(val));
    deleteFormateursDialog.value = false;
    selectedformateurs.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

// *********************************************************************************
const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    // product.value = {};
    // submitted.value = false;
    // productDialog.value = true;
    formateur.value = {};
    f_submitted.value = false;
    formateurDialog.value = true;
};

const hideDialog = () => {
    // productDialog.value = false;
    // submitted.value = false;
    formateurDialog.value = false;
    f_submitted.value = false;
};

const saveProduct = () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.price) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    console.log(product);
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < formateurs.value.length; i++) {
        if (formateurs.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    // deleteProductsDialog.value = true;
    deleteFormateursDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedformateurs || !selectedformateurs.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <input type="file" name="contrat" id="contart" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="formateurs"
                    v-model:selection="selectedformateurs"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">gestions des formateurs</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="id" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="nom" header="nom" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">nom</span>
                            {{ slotProps.data.nom }}
                        </template>
                    </Column>
                    <Column field="prenom" header="prenom" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">prenom</span>
                            {{ slotProps.data.prenom }}
                        </template>
                    </Column>
                    <!-- <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="contextPath + 'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
                        </template>
                    </Column> -->
                    <Column field="specialite" header="specialite" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">specialite</span>
                            {{ slotProps.data.specialite }}
                        </template>
                    </Column>
                    <Column field="telephone" header="telephone" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">telephone</span>
                            {{ slotProps.data.telephone }}
                        </template>
                    </Column>
                    <Column field="email" header="email" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">email</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editFormateur(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteFormateur(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="formateurDialog" :style="{ width: '450px' }" header="formateur details" :modal="true" class="p-fluid">
                    <img :src="formateur.image" :alt="formateur.image" v-if="formateur.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">nom</label>
                        <InputText id="nom" v-model.trim="formateur.nom" required="true" autofocus :class="{ 'p-invalid': f_submitted && !formateur.nom }" />
                        <small class="p-invalid" v-if="f_submitted && !formateur.name">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="name">prénom</label>
                        <InputText id="prenom" v-model.trim="formateur.prenom" required="true" autofocus :class="{ 'p-invalid': f_submitted && !formateur.prenom }" />
                        <small class="p-invalid" v-if="f_submitted && !formateur.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">email</label>
                        <InputText id="nom" v-model.trim="formateur.email" required="true" autofocus :class="{ 'p-invalid': f_submitted && !formateur.email }" />
                        <small class="p-invalid" v-if="f_submitted && !formateur.email">email is required.</small>
                    </div>

                    <div class="field">
                        <label for="name">téléphone</label>
                        <InputText id="prenom" v-model.trim="formateur.telephone" required="true" autofocus :class="{ 'p-invalid': f_submitted && !formateur.telephone }" />
                        <small class="p-invalid" v-if="submitted && !formateur.telephone">telephone is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">spécialite</label>
                        <InputText id="prenom" v-model.trim="formateur.specialite" required="true" autofocus :class="{ 'p-invalid': f_submitted && !formateur.specialite }" />
                        <small class="p-invalid" v-if="f_submitted && !formateur.specialite">telephone is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="formateur.description" required="true" rows="3" cols="20" />
                    </div>

                    <h5>image</h5>
                    <input type="file" name="contrat" id="contart" />

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveformateur" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
                    <img :src="contextPath + 'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">Name test</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="field">
                        <label class="mb-3">Category</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Price</label>
                            <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !product.price }" :required="true" />
                            <small class="p-invalid" v-if="submitted && !product.price">Price is required.</small>
                        </div>
                        <div class="field col">
                            <label for="quantity">Quantity</label>
                            <InputNumber id="quantity" v-model="product.quantity" integeronly />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteFormateurDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="formateur"
                            >Are you sure you want to delete <b>{{ formateur.nom }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteFormateurDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteFormateur" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteFormateursDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected formateurs?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedFormateur" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
