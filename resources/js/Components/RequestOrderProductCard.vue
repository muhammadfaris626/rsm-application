<script setup>
    import InputError from '@/Components/InputError.vue';
    import InputLabel from '@/Components/InputLabel.vue';
    import TextInput from '@/Components/TextInput.vue';
    import VueMultiselect from 'vue-multiselect';

    defineProps({
        product: { type: Object, required: true },
        index: { type: Number, required: true },
        options: { type: Array, default: () => [] },
        branchStock: { type: Number, default: 0 },
        usedStock: { type: Number, default: 0 },
        finalStock: { type: Number, default: 0 },
        invalidStock: { type: Boolean, default: false },
        errors: { type: Object, default: () => ({}) },
    });

    defineEmits(['remove', 'select']);
</script>

<template>
    <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div class="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div class="flex items-center gap-3">
                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {{ index + 1 }}
                </span>
                <div>
                    <h2 class="font-semibold text-slate-800">Barang {{ index + 1 }}</h2>
                    <p class="text-xs text-slate-500">Isi kondisi stok dan jumlah permintaan.</p>
                </div>
            </div>
            <button
                type="button"
                class="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Hapus barang"
                @click="$emit('remove')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Z" clip-rule="evenodd" />
                </svg>
                <span class="hidden sm:inline">Hapus</span>
            </button>
        </div>

        <div class="grid grid-cols-2 gap-3 xl:grid-cols-12">
            <div class="col-span-2 xl:col-span-8">
                <InputLabel :for="'product_id_' + index" value="Barang" />
                <VueMultiselect
                    :id="'product_id_' + index"
                    class="mt-1 bg-white"
                    v-model="product.product_id"
                    :options="options"
                    :close-on-select="true"
                    placeholder="Pilih barang"
                    label="label"
                    track-by="id"
                    @select="selected => $emit('select', selected)"
                />
                <InputError class="mt-2" :message="errors['products.' + index + '.product_id']" />
            </div>
            <div class="col-span-1 xl:col-span-2">
                <InputLabel :for="'branch_stock_' + index" value="Stok Cabang" />
                <TextInput
                    :id="'branch_stock_' + index"
                    type="number"
                    class="mt-1 block w-full bg-slate-100 font-semibold text-slate-700"
                    :model-value="branchStock"
                    disabled
                />
            </div>
            <div class="col-span-1 xl:col-span-2">
                <InputLabel :for="'center_stock_' + index" value="Stok Pusat" />
                <TextInput
                    :id="'center_stock_' + index"
                    type="number"
                    class="mt-1 block w-full bg-slate-100 font-semibold text-slate-700"
                    :model-value="product.product_id?.stock ?? 0"
                    disabled
                />
            </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            <div>
                <InputLabel :for="'initial_stock_' + index" value="Stok Awal" />
                <TextInput
                    :id="'initial_stock_' + index"
                    type="number"
                    class="mt-1 block w-full bg-slate-100 font-semibold text-slate-700"
                    :model-value="product.initial_stock"
                    disabled
                />
                <InputError class="mt-2" :message="errors['products.' + index + '.initial_stock']" />
            </div>
            <div>
                <InputLabel :for="'used_quantity_' + index" value="Terpakai" />
                <TextInput
                    :id="'used_quantity_' + index"
                    type="number"
                    min="0"
                    class="mt-1 block w-full bg-white"
                    placeholder="0"
                    v-model="product.used_quantity"
                />
                <InputError class="mt-2" :message="errors['products.' + index + '.used_quantity']" />
            </div>
            <div>
                <InputLabel :for="'damaged_quantity_' + index" value="Rusak" />
                <TextInput
                    :id="'damaged_quantity_' + index"
                    type="number"
                    min="0"
                    class="mt-1 block w-full bg-white"
                    placeholder="0"
                    v-model="product.damaged_quantity"
                />
                <InputError class="mt-2" :message="errors['products.' + index + '.damaged_quantity']" />
            </div>
            <div>
                <InputLabel :for="'quantity_' + index" value="Request" />
                <TextInput
                    :id="'quantity_' + index"
                    type="number"
                    min="1"
                    class="mt-1 block w-full bg-white"
                    placeholder="Jumlah"
                    v-model="product.quantity"
                />
                <InputError class="mt-2" :message="errors['products.' + index + '.quantity']" />
            </div>
            <div class="col-span-2 sm:col-span-1">
                <InputLabel :for="'final_stock_' + index" value="Stok Akhir" />
                <TextInput
                    :id="'final_stock_' + index"
                    type="number"
                    class="mt-1 block w-full border-blue-200 bg-blue-50 font-semibold text-blue-700"
                    :model-value="finalStock"
                    disabled
                />
                <p class="mt-1 text-xs text-slate-500">Sebelum persetujuan</p>
            </div>
        </div>

        <p v-if="invalidStock" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Barang terpakai dan rusak tidak boleh melebihi stok awal.
        </p>
        <p v-else class="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Stok akhir = stok awal + tambahan yang disetujui − terpakai − rusak.
        </p>
    </article>
</template>
