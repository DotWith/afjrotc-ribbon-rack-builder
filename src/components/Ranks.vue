<template>
    <div v-for="(data, kind) in ranks" :key="kind">
        <div v-for="rank in data" :key="rank.id">
            <BadgeOption :id="getRankSvgPath(kind, rank)" :value="getRankSvgPath(kind, rank)"
                :label="`[${kind[0].toUpperCase()}-${rank.id}] ${rank.title}`" :imgSrc="getRankSvgPath(kind, rank)"
                inputType="radio" v-model="checkedRanks" />
        </div>
    </div>
</template>

<script setup>
import { inject, ref, watch, onMounted } from 'vue';
import BadgeOption from './BadgeOption.vue';

const props = defineProps(['folder']);

const ranks = ref({});
const { checkedRanks, getRankSvgPath } = inject('checkedRanks');

const loadRanksData = async (folder) => {
    try {
        const jsonData = await import(`/src/assets/${folder}/ranks/_meta.json`);
        ranks.value = jsonData.default;
    } catch (error) {
        console.error(`Error loading ranks data from folder ${folder}:`, error);
    }
};

watch(() => props.folder, (newFolder) => {
    loadRanksData(newFolder);
}, { immediate: true });

onMounted(() => {
    loadRanksData(props.folder);
});
</script>
