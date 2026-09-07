<template>

	<div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

        	<label class=" ml-2 text-sm font-medium text-gray-900 dark:text-white">
				<span v-if="help" class="cursor-pointer">
					<i :uk-tooltip="`title: ${help}`" class="fa-solid fa-circle-question"></i>
				</span>
				{{ label }}
			</label>

            <select
            	:class="customClass"
            	:name="name"
            	:multiple="multiple"
            	:data-validators="validators"
            	v-model="value"
            	:size="size">

            	<slot></slot>

            </select>

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
		help: {
			type: String,
			required: false,
			default: null
		},
		customClass: {
			type: String,
			required: false,
			default: 'uk-select uk-form-large uk-border-rounded'
		},
		name: {
			type: String,
			required: true
		},
		multiple: {
			type: Boolean,
			default: false
		},
		size: {
			type: Number,
			default: null,
		},
		validators: {
			type: String,
			required: false,
			default: null
		},
		modelValue: {
			type: [String, Number, Array, Object],
			default: ""
		}
	})

	const emit = defineEmits(['update:modelValue'])

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

</script>
