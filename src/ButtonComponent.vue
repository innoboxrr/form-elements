<template>

	<div class="uk-margin">

        <button
			:type="type"
            :class="buttonClass"
            :disabled="disabled">

            {{ value }}

        </button>

    </div>

</template>

<script setup>

	import { useThemeClass } from './composables/useTheme.js'

	const props = defineProps({
		customClass: {
			type: String,
			required: false,
			default: null
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
		value: {
			type: String,
			required: true,
			default: "Enviar"
		},
		type: {
			type: String,
			required: false,
			default: "submit"
		}
	})

	const buttonClass = useThemeClass('button', () => props.customClass)

</script>
