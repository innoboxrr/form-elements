<template>

	<div class="fe-mb">
        <label :class="labelClass">
            <input
                :class="radioClass"
                type="radio"
                :name="name"
                :data-validators="validators"
                :value="val"
                v-model="value">

                {{ text }}

                <slot></slot>

        </label>
    </div>

</template>

<script setup>

	import { computed } from 'vue'
	import { useThemeClass } from './composables/useTheme.js'

	const props = defineProps({

		customClass: {
			type: String,
			required: false,
			default: null
		},

		name: {
			type: String,
			required: true,
		},

		validators: {
			type: String,
			required: false,
			default: null
		},

		text: {
			type: String,
			required: false,
			default: ""
		},

		val: {
			type: String,
			required: true,
		},

		modelValue: {
			default: ""
		},

		/**
		 * Se conserva por compatibilidad, pero ya no se enlaza al atributo:
		 * competia con v-model, que es quien decide si el radio esta
		 * seleccionado comparando modelValue con val.
		 */
		checked: {
			type: Boolean,
			default: false,
		}

	})

	const emit = defineEmits(['update:modelValue'])

	const radioClass = useThemeClass('radio', () => props.customClass)

	const labelClass = useThemeClass('label')

	// El getter devolvia la propia computed en lugar de modelValue, asi que el
	// radio nunca aparecia seleccionado a partir del valor enlazado.
	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

</script>
