<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Link, Head, useForm, usePage } from '@inertiajs/vue3';
    import { ref, watch, computed } from 'vue';
    import InputLabel from "@/Components/InputLabel.vue";
    import InputError from "@/Components/InputError.vue";
    import TextInput from "@/Components/TextInput.vue";
    import Textarea from '@/Components/Textarea.vue';
    import VueMultiselect from "vue-multiselect";
    const props = defineProps({
        employees: {
            type: Array
        },
        branches: {
            type: Array
        }
    });
    const form = useForm({
        employee_id: "",
        from_branch_id: "",
        to_branch_id: "",
        transfer_date: "",
        reason: "",
    });
    // Watch employee_id untuk mengisi from_branch_id
    watch(() => form.employee_id, (selectedEmployee) => {
        if (selectedEmployee) {
            form.from_branch_id = selectedEmployee.branch_id || "";
        }
    });
</script>

<template>
    <Head title="Tambah Mutasi" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full">
            <div class="pb-4 border-b-2 border-dashed dark:border-gray-700">
                <nav class="flex" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li class="inline-flex items-center">
                            <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                Karyawan
                            </a>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link :href="route('mutations.index')" class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Data Mutasi</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Tambah Mutasi</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="pt-4">
                <h1 class="text-xl font-semibold text-blue-600">TAMBAH MUTASI</h1>
                <form @submit.prevent="form.post(route('mutations.store'))">
                    <div class="grid grid-cols-3 gap-2 mt-2 bg-white p-4 rounded-xl">
                        <div>
                            <InputLabel for="employee_id" value="Karyawan" />
                            <VueMultiselect
                                v-model="form.employee_id"
                                :options="props.employees"
                                :close-on-select="true"
                                placeholder="Pilih"
                                label="name"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors.employee_id" />
                        </div>
                        <div>
                            <InputLabel for="from_branch_id" value="Asal Cabang" />
                            <VueMultiselect
                                v-model="form.from_branch_id"
                                :options="props.branches"
                                :close-on-select="true"
                                placeholder="Pilih"
                                label="branch_name"
                                track-by="id"
                                disabled
                            />
                            <InputError class="mt-2" :message="form.errors.from_branch_id" />
                        </div>
                        <div>
                            <InputLabel for="to_branch_id" value="Tujuan Cabang" />
                            <VueMultiselect
                                v-model="form.to_branch_id"
                                :options="props.branches"
                                :close-on-select="true"
                                placeholder="Pilih"
                                label="branch_name"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors.to_branch_id" />
                        </div>
                        <div>
                            <InputLabel for="transfer_date" value="Tanggal Mutasi" />
                            <TextInput
                                id="transfer_date"
                                type="date"
                                class="mt-1 block w-full"
                                v-model="form.transfer_date"
                            />
                            <InputError class="mt-2" :message="form.errors.transfer_date" />
                        </div>
                        <div class="col-span-2">
                            <InputLabel for="reason" value="Keterangan Mutasi" />
                            <Textarea :row="9" v-model="form.reason" :placeholder="'Silahkan masukkan keterangan mutasi disini...'" />
                            <InputError class="mt-2" :message="form.errors.reason" />
                        </div>
                    </div>
                    <div class="mt-6">
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">SIMPAN</button>
                        <Link :href="route('mutations.index')" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">KEMBALI</Link>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
