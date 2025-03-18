<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-md text-white uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
                <slot name="header"></slot>
            </thead>
            <tbody>
                <slot></slot>
            </tbody>
        </table>
        <slot name="pagination"></slot>
    </div>
</template>
