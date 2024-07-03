<template>
    <div :class="{
        'bg-inactive': !isChecked,
        'bg-active': isChecked,
        'no-img': !hasImage,
    }" class="rank-option" @click="toggleCheck">
        <input :type="inputType" :id="id" :value="value" :checked="isChecked" @change="toggleCheck">
        <img :src="imgSrc" v-if="hasImage" :style="imgStyle">
        <label :for="id">{{ label }}</label>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    id: [String, Number],
    value: [String, Number],
    label: String,
    imgSrc: String,
    imgStyle: Object,
    inputType: {
        type: String,
        default: 'radio',
        validator: value => ['radio', 'checkbox'].includes(value),
    },
    modelValue: [String, Number, Array],
});

const emit = defineEmits(['update:modelValue']);

const isChecked = computed(() => {
    if (props.inputType === 'radio') {
        return props.modelValue == props.value;  // Loose comparison to handle string/number mismatch
    } else if (props.inputType === 'checkbox') {
        return Array.isArray(props.modelValue) && props.modelValue.includes(props.value);
    }
    return false;
});

const hasImage = computed(() => !!props.imgSrc);

function toggleCheck() {
    if (props.inputType === 'radio') {
        emit('update:modelValue', props.value);
    } else if (props.inputType === 'checkbox') {
        if (isChecked.value) {
            emit('update:modelValue', props.modelValue.filter(val => val !== props.value));
        } else {
            emit('update:modelValue', [...props.modelValue, props.value]);
        }
    }
};
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
    flex-shrink: 0; /* Prevent shrinking */
}

.rank-option img {
    width: 60px;
    height: 60px;
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
