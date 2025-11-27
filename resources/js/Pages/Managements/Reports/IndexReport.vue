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
        chart: { 
            height: '100%', 
            type: 'area', 
            zoom: { enabled: false }, 
            toolbar: { show: false },
            fontFamily: 'inherit'
        },
        colors: ['#0E9F6E', '#F05252'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: { 
            type: 'datetime', 
            categories: usePage().props.sales.map(sale => sale.date),
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: {
                    height: 300
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                }
            }
        }]
    }));

    const series1 = computed(() => [
        { name: 'Omzet', data: usePage().props.sales.map(sale => sale.total_price) },
        { name: 'Pengeluaran', data: computedPengeluaran.value.map(expenditure => expenditure.total_cost) }
    ]);

    // Options untuk chart
    const chart2 = computed(() => ({
        chart: {
            id: 'vuechart-example',
            toolbar: {
                show: false
            },
            fontFamily: 'inherit',
            spacing: [15, 25, 15, 25], // top, right, bottom, left - lebih banyak spacing
            height: 'auto'
        },
        colors: ['#6366f1'], // Indigo color
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '45%', // Kurangi barHeight lebih banyak untuk spacing lebih besar
                borderRadius: 6,
                distributed: false,
                columnWidth: '60%',
                dataLabels: {
                    position: 'center' // Posisi label di tengah bar
                }
            }
        },
        xaxis: {
            categories: usePage().props.topPenjualan.map(item => item.branch_name),
            labels: {
                style: {
                    fontSize: '13px',
                    fontWeight: 500,
                    colors: '#374151'
                },
                offsetY: 5,
                maxHeight: 120
            },
            axisBorder: {
                show: true,
                color: '#e5e7eb',
                height: 1,
                width: '100%',
                offsetX: 0,
                offsetY: 0
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '13px',
                    fontWeight: 600,
                    colors: '#1f2937'
                },
                maxWidth: 200,
                offsetX: -5,
                offsetY: 0
            },
            axisBorder: {
                show: true,
                color: '#e5e7eb',
                width: 1
            }
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'middle',
            style: {
                fontSize: '12px',
                fontWeight: 700,
                colors: ['#ffffff']
            },
            offsetX: 0,
            offsetY: 0,
            formatter: function(val) {
                return 'Rp ' + new Intl.NumberFormat('id-ID').format(val);
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                opacity: 0.35
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            },
            padding: {
                top: 0,
                right: 20,
                bottom: 0,
                left: 20
            }
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return 'Rp ' + new Intl.NumberFormat('id-ID').format(val);
                }
            }
        },
        responsive: [{
            breakpoint: 1024,
            options: {
                chart: {
                    height: 700,
                    spacing: [15, 20, 15, 20]
                },
                plotOptions: {
                    bar: {
                        barHeight: '40%'
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '12px'
                        },
                        maxWidth: 180
                    }
                },
                dataLabels: {
                    style: {
                        fontSize: '11px'
                    }
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    }
                }
            }
        }, {
            breakpoint: 768,
            options: {
                chart: {
                    height: 600,
                    spacing: [15, 15, 15, 15]
                },
                plotOptions: {
                    bar: {
                        barHeight: '35%'
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '11px'
                        },
                        maxWidth: 150
                    }
                },
                dataLabels: {
                    style: {
                        fontSize: '10px'
                    }
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '11px'
                        }
                    }
                }
            }
        }]
    }));
    // Data untuk chart
    const series2 = computed(() => [{
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

    const chartOptions = computed(() => ({
        series: [
            {
            name: 'Penjualan',
            data: Object.values(penjualanTahunan.value)
            }
        ],
        chart: {
            height: '100%',
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'inherit'
        },
        plotOptions: {
            bar: {
            borderRadius: 8,
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
            fontSize: '11px',
            colors: ["#304758"],
            fontWeight: 600
            }
        },
        xaxis: {
            categories: Object.keys(penjualanTahunan.value),
            position: 'top',
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    fontSize: '12px'
                }
            },
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
            show: true,
            style: {
                fontSize: '12px'
            },
            formatter: (val) => `Rp ${val}`
            }
        },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: {
                    height: 300
                },
                dataLabels: {
                    style: {
                        fontSize: '9px'
                    },
                    offsetY: -15
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                }
            }
        }]
    }));

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
<template>
    <Head title="Laporan" />
    <AuthenticatedLayout>
        <div class="grid grid-cols-1 h-full space-y-6">
            <!-- Header Card -->
            <div class="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">Laporan</h1>
                        <p class="text-cyan-100 mt-1">Analisis dan ringkasan data operasional</p>
                    </div>
                    <div class="hidden md:block">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filter and Action Bar -->
            <div class="bg-white rounded-xl shadow-md p-4">
                <div class="flex flex-col lg:flex-row justify-between gap-4">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Cetak:</span>
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
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Export:</span>
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
                    <div class="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Cabang:</span>
                            <div class="w-56">
                                <VueMultiselect
                                    v-model="selectBranch"
                                    :options="branches"
                                    :close-on-select="true"
                                    placeholder="Pilih cabang"
                                    label="branch_name"
                                    track-by="id"
                                />
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Dari:</span>
                            <div class="w-40">
                                <TextInput
                                    id="startDate"
                                    type="date"
                                    class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-all duration-200"
                                    v-model="selectStartDate"
                                />
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Sampai:</span>
                            <div class="w-40">
                                <TextInput
                                    id="endDate"
                                    type="date"
                                    class="bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-all duration-200"
                                    v-model="selectEndDate"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stat Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <div class="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2">
                        <p class="text-center text-white font-semibold text-sm uppercase">Omzet</p>
                    </div>
                    <p class="text-center text-2xl p-4 text-green-600 font-bold">
                        {{ formatRupiah((sales || []).reduce((sum, item) => sum + Number(item.total_price), 0)) }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <div class="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2">
                        <p class="text-center text-white font-semibold text-sm uppercase">Pengeluaran</p>
                    </div>
                    <p class="text-center text-2xl p-4 text-red-600 font-bold">
                        {{ formatRupiah(expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)) }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2">
                        <p class="text-center text-white font-semibold text-sm uppercase">Permintaan Stok</p>
                    </div>
                    <p class="text-center text-2xl p-4 text-yellow-600 font-bold">
                        {{ orders.length }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2">
                        <p class="text-center text-white font-semibold text-sm uppercase">Permintaan Return</p>
                    </div>
                    <p class="text-center text-2xl p-4 text-purple-600 font-bold">
                        {{ returns.length }}
                    </p>
                </div>
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                        <p class="text-center text-white font-semibold text-sm uppercase">Pembelian Persediaan</p>
                    </div>
                    <p class="text-center text-2xl p-4 text-blue-600 font-bold">
                        {{ formatRupiah(purchases.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0) }}
                    </p>
                </div>
            </div>
            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden min-h-[400px]">
                    <div class="grid grid-cols-2 gap-4 px-4 pt-4 text-center bg-gradient-to-r from-green-50 to-red-50">
                        <div>
                            <p class="text-green-600 font-medium">Omzet</p>
                            <p class="text-xl font-bold text-green-600">
                                {{ formatRupiah(sales.reduce((sum, item) => sum + Number(item.total_price), 0) ?? 0) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-red-600 font-medium">Pengeluaran</p>
                            <p class="text-xl font-bold text-red-600">
                                {{ formatRupiah(expenditures.reduce((sum, item) => sum + Number(item.total_cost), 0)) }}
                            </p>
                        </div>
                    </div>
                    <div class="w-full" style="min-height: 350px;">
                        <VueApexCharts type="area" :options="chart1" :series="series1"></VueApexCharts>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                        <p class="text-center text-white font-semibold uppercase">
                            Penjualan {{ new Date().getFullYear() }}
                        </p>
                    </div>
                    <div class="flex-grow w-full" style="min-height: 350px;">
                        <VueApexCharts type="bar" height="100%" :options="chartOptions" :series="chartOptions.series" />
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <Table>
                    <template #header>
                        <TableRow class="bg-cyan-500">
                            <TableHeaderCell class="text-white">NO</TableHeaderCell>
                            <TableHeaderCell class="text-white">CABANG</TableHeaderCell>
                            <TableHeaderCell class="text-white">OMZET</TableHeaderCell>
                            <TableHeaderCell class="text-white">PENGELUARAN</TableHeaderCell>
                            <TableHeaderCell class="text-white text-center">PERMINTAAN STOK</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #default>
                        <TableRow v-for="(data, index) in allData" :key="data.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-cyan-50 dark:hover:bg-gray-600 transition-colors duration-150">
                            <TableDataCell :status="'number'">{{ index+1 }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ data.branch_name }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ formatRupiah(data.omzet) }}</TableDataCell>
                            <TableDataCell :status="'record'">{{ formatRupiah(data.pengeluaran) }}</TableDataCell>
                            <TableDataCell :status="'record'" class="text-center">{{ data.permintaan_pesanan.length }}</TableDataCell>
                        </TableRow>
                    </template>
                </Table>
            </div>

            <!-- Top 10 Chart Section -->
            <div class="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden w-full">
                <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                    <p class="text-center text-white font-bold text-lg uppercase tracking-wide">
                        Top #10 Penjualan Cabang
                    </p>
                </div>
                <div class="w-full px-6 py-6" style="min-height: 600px;">
                    <VueApexCharts type="bar" height="100%" :options="chart2" :series="series2" />
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
