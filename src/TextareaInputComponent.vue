<template>

	<div class="fe-mb">

        <div class="fe-inline fe-w-full">

        	<label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>

            <textarea
            	:class="areaClass"
            	:rows="rows"
            	:name="name"
            	:placeholder="placeholder"
            	:data-validators="validators"
            	:data-min_length="min_length"
            	:data-max_length="max_length"
            	v-model="value"></textarea>

        </div>

    </div>

</template>

<script setup>

	import { computed } from 'vue'
	import { useThemeClass } from './composables/useTheme.js'

	const props = defineProps({
		label: {
			type: String,
			required: false,
			default: ''
		},
		customClass: {
			type: String,
			required: false,
			default: null
		},
		rows: {
			type: Number,
			default: 5
		},
		name: {
			type: String,
			required: true
		},
		placeholder: {
			type: String,
			required: false,
			default: null
		},
		validators: {
			type: String,
			required: false,
			default: null
		},
		min_length: {
			type: String,
			required: false,
			default: null
		},
		max_length: {
			type: String,
			required: false,
			default: null
		},
		modelValue: {
			type: String,
			default: ""
		}
	})

	const emit = defineEmits(['update:modelValue'])

	const areaClass = useThemeClass('textarea', () => props.customClass)

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

</script>
