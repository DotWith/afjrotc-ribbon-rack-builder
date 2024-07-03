<template>
    <div>
        <ul>
            <li :class="{
                'bg-inactive': tab.hash !== activeTabHash,
                'bg-active': tab.hash === activeTabHash,
            }" v-for="tab in tabs" :key="tab.title" @click="activeTabHash = tab.hash">
                {{ tab.title }}
            </li>
        </ul>
        <slot />
    </div>
</template>

<script setup>
import { ref, provide } from 'vue';

const activeTabHash = ref('');
const tabs = ref([]);

provide('addTab', (tab) => {
    const count = tabs.value.push(tab);

    if (count === 1) {
        activeTabHash.value = tab.hash;
    }
});
provide('activeTabHash', activeTabHash);
</script>

<style scoped>
div {
    border: 1px solid #ccc;
}

ul {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    width: 100%;
    text-transform: uppercase;
    font-weight: 900;
    text-align: center;
    padding: 1rem 0;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
}
</style>
