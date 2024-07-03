<template>
    <div v-for="ribbon in ribbons" :key="ribbon.id">
        <RibbonOption :id="getRibbonSvgPath(ribbon.id)" :value="ribbon.id"
            :label="`${ribbon.id}. ${ribbon.title}`" :imgSrc="getRibbonSvgPath(ribbon.id)"
            inputType="checkbox" v-model="checkedRibbons" />
    </div>
</template>

<script setup>
import { inject, ref, watch, onMounted } from 'vue';
import RibbonOption from './RibbonOption.vue';

const props = defineProps(['folder']);

const ribbons = ref({});
const { checkedRibbons, getRibbonSvgPath } = inject('checkedRibbons');

const loadRibbonsData = async (folder) => {
    try {
        const jsonData = await import(`/src/assets/${folder}/ribbons/_meta.json`);
        ribbons.value = jsonData.default;
    } catch (error) {
        console.error(`Error loading ribbons data from folder ${folder}:`, error);
    }
};

watch(() => props.folder, (newFolder) => {
    loadRibbonsData(newFolder);
}, { immediate: true });

onMounted(() => {
    loadRibbonsData(props.folder);
});
</script>
