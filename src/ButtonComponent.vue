<template>

	<div class="uk-margin">

        <button
			:type="type"
            :class="buttonClass"
            :disabled="disabled">

            <slot>{{ value }}</slot>

        </button>

    </div>

</template>

<script setup>

	import { computed } from 'vue'
	import { useThemeClass } from './composables/useTheme.js'

	const TOKENS = {
		primary: 'button',
		secondary: 'buttonSecondary',
		danger: 'buttonDanger',
		link: 'buttonLink',
	}

	const props = defineProps({
		/**
		 * Elige el token del tema. Sin esto, un formulario generado tendria
		 * que escribir la clase del boton secundario a mano, que es justo lo
		 * que el tema viene a evitar.
		 */
		variant: {
			type: String,
			required: false,
			default: 'primary'
		},
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
			required: false,
			default: "Enviar"
		},
		type: {
			type: String,
			required: false,
			default: "submit"
		}
	})

	const token = computed(() => TOKENS[props.variant] ?? 'button')

	const buttonClass = useThemeClass(token, () => props.customClass)

</script>
