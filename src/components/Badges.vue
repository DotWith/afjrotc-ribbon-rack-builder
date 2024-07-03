<template>
    <div v-for="(id, kind) in badges" :key="kind">
        <BadgeOption :id="getBadgeSvgPath(id)" :value="getBadgeSvgPath(id)" :label="kind" :imgSrc="getBadgeSvgPath(id)"
            inputType="checkbox" v-model="checkedBadges" />
    </div>
</template>

<script setup>
import { inject, ref, watch, onMounted } from 'vue';
import BadgeOption from './BadgeOption.vue';

const props = defineProps(['folder']);

const badges = ref({});
const { checkedBadges, getBadgeSvgPath } = inject('checkedBadges');

const loadBadgesData = async (folder) => {
    try {
        const jsonData = await import(`/src/assets/${folder}/badges/_meta.json`);
        badges.value = jsonData.default;
    } catch (error) {
        console.error(`Error loading badges data from folder ${folder}:`, error);
    }
};

watch(() => props.folder, (newFolder) => {
    loadBadgesData(newFolder);
}, { immediate: true });

onMounted(() => {
    loadBadgesData(props.folder);
});
</script>
