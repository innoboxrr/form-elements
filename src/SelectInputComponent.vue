<template>

	<div class="fe-mb">

        <div class="fe-inline fe-w-full">

        	<label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
				<span v-if="help" class="cursor-pointer">
					<i
						:class="classFor('helpIcon')"
						:data-tooltip="help"
						:aria-label="help"
						tabindex="0"></i>
				</span>
				{{ label }}
			</label>

            <select
            	:class="selectClass"
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

	import { classFor } from 'innoboxrr-form-core'

	import { computed } from 'vue'
	import { useThemeClass } from './composables/useTheme.js'

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
			default: null
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

	const selectClass = useThemeClass('select', () => props.customClass)

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

</script>
