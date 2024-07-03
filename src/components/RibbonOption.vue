<template>
    <div :class="{
        'bg-inactive': !isChecked,
        'bg-active': isChecked,
        'no-img': !hasImage,
    }" class="rank-option" @click="toggleCheck">
        <input type="checkbox" :id="id" :value="value" :checked="isChecked">
        <img :src="imgSrc" v-if="hasImage">
        <label>{{ label }}</label>
        <input type="range" min="0" max="25" value="0" v-model="devices" @click.stop />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    id: [String, Number],
    value: Number,
    label: String,
    imgSrc: String,
    modelValue: Array,
});
const devices = ref(0);

const emit = defineEmits(['update:modelValue']); // { id: Number, devices: Number }

const isChecked = computed(() => {
    return props.modelValue.some(item => item[0] === props.value && item[1] === parseInt(devices.value));
});

const hasImage = computed(() => !!props.imgSrc);

function toggleCheck() {
    const index = props.modelValue.findIndex(item => item[0] === props.value);
    if (index !== -1) {
        // Remove if already checked
        const updatedValue = [...props.modelValue.slice(0, index), ...props.modelValue.slice(index + 1)];
        emit('update:modelValue', updatedValue);
    } else {
        // Add if not checked
        emit('update:modelValue', [...props.modelValue, [props.value, parseInt(devices.value)]]);
    }
};

// Watch devices and update the modelValue if the range input changes
watch(devices, (newVal) => {
    const index = props.modelValue.findIndex(item => item[0] === props.value);
    if (index !== -1) {
        // Update the existing entry with the new devices value
        const updatedValue = [...props.modelValue];
        updatedValue[index][1] = parseInt(newVal);
        emit('update:modelValue', updatedValue);
    } else {
        // Add a new entry if it doesn't exist
        emit('update:modelValue', [...props.modelValue, [props.value, parseInt(newVal)]]);
    }
});
</script>

<style scoped>
.rank-option {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.rank-option input[type="radio"],
.rank-option input[type="checkbox"] {
    margin-right: 24px;
    height: 15px;
    width: 15px;
    accent-color: rgb(213, 210, 204);
    flex-shrink: 0;
}

.rank-option input[type="range"] {
    appearance: none;
    width: 125px;
    height: 15px;
    background: #ccc;
    border: 1px solid #999;
    border-radius: 1px;
    margin-left: auto;
}

.rank-option input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #555;
    cursor: pointer;
    border: 1px solid #333;
    border-radius: 1px;
}

.rank-option input[type="range"]::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #555;
    cursor: pointer;
    border: 1px solid #333;
    border-radius: 1px;
}

.rank-option input[type="range"]::-ms-thumb {
    width: 15px;
    height: 15px;
    background: #555;
    cursor: pointer;
    border: 1px solid #333;
    border-radius: 1px;
}

.rank-option img {
    width: 100px;
    height: 30px;
    margin-right: 24px;
    object-fit: contain;
}

.rank-option.no-img label {
    margin-left: 84px;
}

label {
    cursor: pointer;
}
</style>
