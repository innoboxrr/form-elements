<template>

	<div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

        	<label class=" ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>

            <textarea
            	class="uk-textarea uk-form-large uk-border-rounded"
            	:class="customClass"
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

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

</script>
