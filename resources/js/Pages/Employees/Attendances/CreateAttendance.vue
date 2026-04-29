<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head, Link, useForm } from '@inertiajs/vue3';
    import InputError from '@/Components/InputError.vue';
    import InputLabel from '@/Components/InputLabel.vue';
    import TextInput from '@/Components/TextInput.vue';
    import VueMultiselect from 'vue-multiselect';

    const props = defineProps({
        employees: {
            type: Array,
            default: () => [],
        },
    });

    const form = useForm({
        employee_id: '',
        work_date: '',
        check_in: '',
        check_out: '',
    });
</script>

<template>
    <Head title="Tambah Absensi" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full">
            <div class="pb-4 border-b-2 border-dashed dark:border-gray-700">
                <nav class="flex" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li class="inline-flex items-center">
                            <span class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400">
                                Karyawan
                            </span>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link :href="route('attendances.index')" class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Data Absensi</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Tambah Absensi</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div class="pt-4">
                <h1 class="text-xl font-semibold text-sky-600">TAMBAH ABSENSI</h1>
                <form @submit.prevent="form.post(route('attendances.store'))">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-white p-4 rounded-xl">
                        <div class="md:col-span-2">
                            <InputLabel for="employee_id" value="Karyawan" />
                            <VueMultiselect
                                v-model="form.employee_id"
                                :options="props.employees"
                                :close-on-select="true"
                                placeholder="Pilih karyawan"
                                label="name"
                                track-by="id"
                            />
                            <InputError class="mt-2" :message="form.errors['employee_id.id'] || form.errors.employee_id" />
                        </div>

                        <div>
                            <InputLabel for="work_date" value="Tanggal Kerja" />
                            <TextInput
                                id="work_date"
                                v-model="form.work_date"
                                type="date"
                                class="mt-1 block w-full"
                            />
                            <InputError class="mt-2" :message="form.errors.work_date" />
                        </div>

                        <div>
                            <InputLabel for="check_in" value="Jam Masuk" />
                            <TextInput
                                id="check_in"
                                v-model="form.check_in"
                                type="datetime-local"
                                class="mt-1 block w-full"
                            />
                            <InputError class="mt-2" :message="form.errors.check_in" />
                        </div>

                        <div>
                            <InputLabel for="check_out" value="Jam Keluar" />
                            <TextInput
                                id="check_out"
                                v-model="form.check_out"
                                type="datetime-local"
                                class="mt-1 block w-full"
                            />
                            <InputError class="mt-2" :message="form.errors.check_out" />
                        </div>
                    </div>

                    <div class="mt-6">
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">SIMPAN</button>
                        <Link :href="route('attendances.index')" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">KEMBALI</Link>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
