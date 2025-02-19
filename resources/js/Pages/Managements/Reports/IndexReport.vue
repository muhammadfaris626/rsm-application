<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { ref, computed, watch, onMounted } from 'vue';
    import { usePage, useForm, router, Head } from '@inertiajs/vue3';
    import { usePermission } from '@/Composables/permissions';
    import VueMultiselect from "vue-multiselect";
    import InputLabel from '@/Components/InputLabel.vue';
    import InputError from '@/Components/InputError.vue';
    import TextInput from "@/Components/TextInput.vue";
    import VueApexCharts from 'vue3-apexcharts';
    import Table from '@/Components/Custom/Table.vue';
    import TableRow from '@/Components/Custom/TableRow.vue';
    import TableHeaderCell from '@/Components/Custom/TableHeaderCell.vue';
    import TableDataCell from '@/Components/Custom/TableDataCell.vue';
    import TablePagination from '@/Components/Custom/TablePagination.vue';
    const { hasPermission } = usePermission();
    defineProps(['branches', 'sales', 'expenditures', 'purchases', 'orders', 'returns', 'penjualanTahunan', 'topPenjualan', 'allData']);
    const selectBranch = ref(''), selectStartDate = ref(''), selectEndDate = ref('');
    let optionBranch = ref(selectBranch), optionStartDate = ref(selectStartDate), optionEndDate = ref(selectEndDate);
    const filterUrl = computed(() => {
        let url = new URL(route('reports.index'));
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
            router.visit(route("reports.index"), {
                replace: true
            });
        }
    });

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    }
    const computedPengeluaran = computed(() => usePage().props.expenditures || []);
    const chart1 = computed(() => ({
        chart: { height: '100%', type: 'area', zoom: { enabled: false }, toolbar: { show: false } },
        colors: ['#0E9F6E', '#F05252'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: { type: 'datetime', categories: usePage().props.sales.map(sale => sale.date) },
        tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
    }));

    const series1 = computed(() => [
        { name: 'Omzet', data: usePage().props.sales.map(sale => sale.total_price) },
        { name: 'Pengeluaran', data: computedPengeluaran.value.map(expenditure => expenditure.total_cost) }
    ]);

    // Options untuk chart
    const chart2 = ref({
        chart: {
            id: 'vuechart-example',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: true  // Mengubah bar chart menjadi horizontal
            }
        },
        xaxis: {
            categories: usePage().props.topPenjualan.map(item => item.branch_name)
        }
    });
    // Data untuk chart
    const series2 = ref([{
        name: 'Total Penjualan',
        data: usePage().props.topPenjualan.map(item => item.total_sales ?? 0)
    }])

    const penjualanTahunan = computed(() => usePage().props.penjualanTahunan || {});
    const chart3 = computed(() => ({
        chart: {
            id: 'vuechart-example',
            toolbar: { show: false }
        },
        xaxis: {
            categories: Object.keys(penjualanTahunan.value),
        },
    }));

    const series3 = computed(() => [{
        name: 'Penjualan',
        data: Object.values(penjualanTahunan.value)
    }]);

    const chartOptions = ref({
        series: [
            {
            name: 'Inflation',
            data: Object.values(penjualanTahunan.value)
            }
        ],
        chart: {
            height: 350,
            type: 'bar',
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
            borderRadius: 10,
            dataLabels: {
                position: 'top',
            },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `Rp ${val}`,
            offsetY: -20,
            style: {
            fontSize: '10px',
            colors: ["#304758"]
            }
        },
        xaxis: {
            categories: Object.keys(penjualanTahunan.value),
            position: 'top',
            axisBorder: { show: false },
            axisTicks: { show: false },
            crosshairs: {
            fill: {
                type: 'gradient',
                gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
                }
            }
            },
            tooltip: { enabled: true }
        },
        yaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
            show: false,
            formatter: (val) => `${val}%`
            }
        },
        title: {
            text: `Penjualan Tahunan ${new Date().getFullYear()}`,
            floating: true,
            offsetY: 330,
            align: 'center',
            style: { color: '#444' }
        }
    });

    const selectCetak = ref('');
    const pilihanCetak = ref([
        { id: 1, pilihan: 'Omzet' },
        { id: 2, pilihan: 'Pengeluaran' },
        { id: 3, pilihan: 'Pembelian Persediaan' },
        { id: 4, pilihan: 'Permintaan Stok' },
        { id: 5, pilihan: 'Permintaan Return' },
    ]);
    const form = useForm({
        pilihan: "",
        branch_id: "",
        tanggal_mulai: "",
        tanggal_selesai: ""
    });
    watch(selectCetak, (newValue) => {
        form.pilihan = newValue.pilihan;
        form.branch_id = optionBranch.value.id;
        form.tanggal_mulai = optionStartDate;
        form.tanggal_selesai = optionEndDate;
        const url = route('cetak', form);
        window.open(url, '_blank');
    });
    const selectExport = ref('');
    watch(selectExport, (newValue) => {
        form.pilihan = newValue.pilihan;
        form.branch_id = optionBranch.value.id;
        form.tanggal_mulai = optionStartDate;
        form.tanggal_selesai = optionEndDate;
        const url = route('export', form);
        window.open(url);
    });
</script>
<style scoped>
    .chart-container {
        height: 400px; /* Pastikan semua chart memiliki tinggi yang sama */
        display: flex;
        flex-direction: column;
    }

    .chart-wrapper {
        flex-grow: 1;
    }
</style>
<template>
    <Head title="Laporan" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full gap-4">
            <div class="pb-4 border-b-2 border-dashed dark:border-gray-700">
                <nav class="flex" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li class="inline-flex items-center">
                            <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                </svg>
                                Manajemen
                            </a>
                        </li>
                        <li aria-current="page">
                            <div class="flex items-center">
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Laporan</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div class="flex justify-between">
                <div>
                    <div class="flex justify-start">
                        <div class="flex items-center justify-start mr-2">
                            Cetak :
                        </div>
                        <div class="w-56">
                            <VueMultiselect
                                v-model="selectCetak"
                                :options="pilihanCetak"
                                :close-on-select="true"
                                placeholder="Pilih cetak"
                                label="pilihan"
                                track-by="id"
                            />
                        </div>
                        <div class="flex items-center justify-start mr-2 ml-2">
                            Export :
                        </div>
                        <div class="w-56">
                            <VueMultiselect
                                v-model="selectExport"
                                :options="pilihanCetak"
                                :close-on-select="true"
                                placeholder="Pilih export"
                                label="pilihan"
                                track-by="id"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-end">
                        <div class="flex items-center justify-start mx-2">
                            Cabang :
                        </div>
                        <div class="w-64">
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
            <div class="grid grid-cols-5 gap-4">
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
                    <p class="font-thin uppercase text-center py-1 bg-yellow-500 rounded-t-xl text-white">
                        <strong>Permintaan Stok</strong>
                    </p>
                    <p class="uppercase text-center text-3xl p-4 text-yellow-500 font-bold">
                        {{ orders.length }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg">
                    <p class="font-thin uppercase text-center py-1 bg-purple-500 rounded-t-xl text-white">
                        <strong>Permintaan Return</strong>
                    </p>
                    <p class="uppercase text-center text-3xl p-4 text-purple-500 font-bold">
                        {{ returns.length }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg">
                    <p class="font-thin uppercase text-center py-1 bg-blue-500 rounded-t-xl text-white">
                        <strong>Pembelian Persediaan</strong>
                    </p>
                    <p class="uppercase text-center text-3xl p-4 text-blue-500 font-bold">
                        {{ formatRupiah(purchases.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0) }}
                    </p>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <div class="grid grid-cols-1 border-2 rounded-xl bg-white">
                    <div class="grid grid-cols-2 gap-4 px-4 pt-2 text-center">
                        <div>
                            <p class="text-green-500">Omzet</p>
                            <p class="text-xl font-semibold text-green-500">
                                {{ formatRupiah(sales.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-red-500">Pengeluaran</p>
                            <p class="text-xl font-semibold text-red-500">
                                {{ formatRupiah(expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)) }}
                            </p>
                        </div>
                    </div>
                    <div>
                        <VueApexCharts type="area" :options="chart1" :series="series1"></VueApexCharts>
                    </div>
                </div>
                <div class="chart-container border-2 rounded-xl bg-white">
                    <p class="font-thin uppercase text-center bg-blue-500 rounded-t-xl text-white flex items-center justify-center py-3">
                        <strong>Penjualan {{ new Date().getFullYear() }}</strong>
                    </p>
                    <div class="chart-wrapper">
                        <VueApexCharts type="bar" height="95%" :options="chartOptions" :series="chartOptions.series" />
                    </div>
                </div>

                <div class="chart-container border-2 rounded-xl bg-white">
                    <p class="font-thin uppercase text-center bg-blue-500 rounded-t-xl text-white flex items-center justify-center py-3">
                        <strong>Top #10 Penjualan Cabang</strong>
                    </p>
                    <div class="chart-wrapper">
                        <VueApexCharts type="bar" height="95%" :options="chart2" :series="series2" />
                    </div>
                </div>
            </div>
            <div>
                <Table>
                    <template #header>
                        <TableHeaderCell>No</TableHeaderCell>
                        <TableHeaderCell>CABANG</TableHeaderCell>
                        <TableHeaderCell>OMZET</TableHeaderCell>
                        <TableHeaderCell>PENGELUARAN</TableHeaderCell>
                        <TableHeaderCell class="text-center">PERMINTAAN STOK</TableHeaderCell>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in allData" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <TableDataCell :status="'number'">{{ index+1 }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.branch_name }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ formatRupiah(data.omzet) }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ formatRupiah(data.pengeluaran) }}</TableDataCell>
                            <TableDataCell :status="'record'" class="text-center">{{ data.permintaan_pesanan.length }}</TableDataCell>
                        </TableRow>
                    </template>
                </Table>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
