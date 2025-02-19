<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, computed, watch, onMounted } from 'vue';
    import { usePage, useForm, router, Head } from '@inertiajs/vue3';
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    import VueMultiselect from "vue-multiselect";
    import InputLabel from '@/Components/InputLabel.vue';
    import TextInput from "@/Components/TextInput.vue";
    defineProps(['branches', 'sales', 'employeeActive', 'branchActive', 'expenditures', 'profile', 'userRoleVisitor']);
    const selectBranch = ref(''), selectStartDate = ref(''), selectEndDate = ref('');
    let optionBranch = ref(selectBranch), optionStartDate = ref(selectStartDate), optionEndDate = ref(selectEndDate);
    const filterUrl = computed(() => {
        let url = new URL(route('dashboard'));
        if (optionBranch.value) {
            url.searchParams.append("branch", optionBranch.value.id);
        }
        if (optionStartDate.value && optionEndDate.value) {
            url.searchParams.append("start_date", optionStartDate.value);
            url.searchParams.append("end_date", optionEndDate.value);
        }
        return url;
    });
    watch(() => filterUrl.value, (updatedFilterUrl) => {
        router.visit(updatedFilterUrl, {
            preserveScroll: true,
            preserveState: true,
            replace: true
        });
    });
    onMounted(() => {
        if (window.location.search) {
            router.visit(route("dashboard"), {
                replace: true
            });
        }
    });
    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
    }

</script>
<script>
export default {
  inheritAttrs: false
}
</script>


<template>
    <Head title="Beranda" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full gap-4">
            <div class="pb-4 border-b-2 border-dashed dark:border-gray-700">
                <nav class="flex" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li class="inline-flex items-center">
                            <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                Beranda
                            </a>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="flex justify-between">
                <div>

                </div>
                <div>
                    <div class="flex justify-end">
                        <div v-if="userRoleVisitor != 'admin-branch'" class="flex items-center justify-start mx-2">
                            Cabang :
                        </div>
                        <div v-if="userRoleVisitor != 'admin-branch'" class="w-64">
                            <VueMultiselect
                                v-model="selectBranch"
                                :options="branches"
                                :close-on-select="true"
                                placeholder="Pilih cabang"
                                label="branch_name"
                                track-by="id"
                            />
                        </div>
                        <div class="flex items-center justify-start mx-2">
                            Dari :
                        </div>
                        <div class="w-30">
                            <TextInput
                                id="name"
                                type="date"
                                class="block w-full bg-white"
                                v-model="selectStartDate"
                            />
                        </div>
                        <div class="flex items-center justify-start mx-2">
                            Sampai :
                        </div>
                        <div class="w-30">
                            <TextInput
                                id="name"
                                type="date"
                                class="block w-full bg-white"
                                v-model="selectEndDate"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-4 gap-4">
                <div class="bg-white rounded-xl shadow-lg">
                    <p class="font-thin uppercase text-center py-1 bg-green-500 rounded-t-xl text-white">
                        <strong>Omzet</strong>
                    </p>
                    <p class="uppercase text-center text-3xl p-4 text-green-500 font-bold">
                        {{ formatRupiah((sales || []).reduce((sum, item) => sum + Number(item.total_price), 0)) }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg">
                    <p class="font-thin uppercase text-center py-1 bg-red-500 rounded-t-xl text-white">
                        <strong>Pengeluaran</strong>
                    </p>
                    <p class="uppercase text-center text-3xl p-4 text-red-500 font-bold">
                        {{ formatRupiah(expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)) }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg">
                    <p class="font-thin uppercase text-center py-1 bg-blue-500 rounded-t-xl text-white">
                        <strong>Karyawan Aktif</strong>
                    </p>
                    <p class="uppercase text-center text-3xl p-4 text-blue-500 font-bold">
                        {{ employeeActive }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg">
                    <p class="font-thin uppercase text-center py-1 bg-purple-500 rounded-t-xl text-white">
                        <strong>Cabang Aktif</strong>
                    </p>
                    <p class="uppercase text-center text-3xl p-4 text-purple-500 font-bold">
                        {{ branchActive }}
                    </p>
                </div>
                <div v-if="profile != null" class="bg-white rounded-xl shadow-lg col-span-4">
                    <p class="font-thin uppercase text-center py-1 bg-yellow-700 rounded-t-xl text-white">
                        <strong>Profil Cabang</strong>
                    </p>
                    <p class="text-justify text-xl p-4 text-gray-500">
                        {{ profile.description }}
                    </p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
