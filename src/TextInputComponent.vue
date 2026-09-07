<template>

	<div class="fe-mb">

        <div class="fe-inline fe-w-full">

        	<label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
				<span v-if="help" class="cursor-pointer">
					<i :uk-tooltip="`title: ${help}`" class="fa-solid fa-circle-question"></i>
				</span>
				{{ label }}
			</label>

            <span
            	v-if="hasIcon"
            	class="fe-field-icon"
            	:uk-icon="iconAttr"></span>

            <div class="fe-input-wrap">

                <input
                	:data-uid="uid"
                	:class="[inputClass, isPassword ? 'fe-has-toggle' : '']"
                	:type="effectiveType"
                	:name="name"
                	:placeholder="placeholder"
                	:autofocus="autofocus"
                	:autocomplete="autocomplete"
                	:data-validators="validators"
                	:data-min_length="min_length"
                	:data-max_length="max_length"
                	:min="min_length"
                	:max="max_length"
                	:step="steps"
                	:readonly="readonly"
                	v-format="maskFormat"
                	@keyup.enter="emit('enter', $event)"
                	@input="emit('input', $event)"
                	@focus="emit('focus', $event)"
                	@blur="emit('blur', $event)"
    				@paste="emit('paste', $event)"
                	v-model="value">

                <button
                	v-if="isPassword"
                	type="button"
                	tabindex="-1"
                	class="fe-password-toggle"
                	:aria-label="showPassword ? 'Hide password' : 'Show password'"
                	@click="showPassword = !showPassword">
                	<i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>

            </div>

        </div>

    </div>

</template>

<script setup>

	import { computed, ref, useId } from 'vue'
	import { formatDirective as vFormat } from 'innoboxrr-maskjs/vue'
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
		icon: {
			type: String,
			required: false,
			default: ""
		},
		customClass: {
			type: String,
			required: false,
			default: null
		},
		type: {
			type: String,
			required: true,
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
		autofocus: {
			default: null
		},
		autocomplete: {
			type: String,
			default: null,
		},
		validators: {
			type: String,
			required: false,
			default: null
		},
		min_length: {
			type: [String, Number],
			required: false,
			default: null
		},
		max_length: {
			type: [String, Number],
			required: false,
			default: null
		},
		steps:{
			type: [String, Number],
			default: null
		},
		readonly: {
			type: Boolean,
			default: null
		},
		// Vue 3 exige factoria: un literal comparte la misma instancia entre
		// todos los montajes del componente.
		maskFormat:{
			type: Object,
			default: () => ({}),
		},
		modelValue: {
			default: ""
		}
	})

	const emit = defineEmits(['update:modelValue', 'enter', 'focus', 'blur', 'input', 'paste'])

	// Antes se usaba la global `chance.hash()`, que obligaba a que la app
	// anfitriona la pusiera en window: el componente no se podia montar fuera
	// de ella. useId() es la primitiva de Vue para esto.
	// La clase sale del tema del proyecto; customClass queda para el
	// caso puntual.
	const inputClass = useThemeClass('input', () => props.customClass)

	const uid = useId()

	const showPassword = ref(false)

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

	const hasIcon = computed(() => props.icon !== '' && props.icon != null)

	const iconAttr = computed(() => props.icon === '' ? '' : `icon: ${props.icon}`)

	const isPassword = computed(() => props.type === 'password')

	const effectiveType = computed(() => {

		if (props.type !== 'password') {
			return props.type
		}

		return showPassword.value ? 'text' : 'password'

	})

</script>

<style scoped>
	.fe-input-wrap {
		position: relative;
		width: 100%;
	}

	/* Reserve room on the right so the typed text never runs under the eye */
	.fe-input-wrap :deep(.fe-has-toggle) {
		padding-right: 2.75rem;
	}

	.fe-password-toggle {
		position: absolute;
		top: 50%;
		right: 0.75rem;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0;
		margin: 0;
		background: transparent;
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		color: #6b7280;
		transition: color 0.15s ease, background-color 0.15s ease;
		z-index: 2;
	}

	.fe-password-toggle:hover {
		color: #111827;
		background-color: rgba(0, 0, 0, 0.05);
	}

	.fe-password-toggle:focus {
		outline: none;
	}

	:global(.dark) .fe-password-toggle,
	:global(html.dark) .fe-password-toggle {
		color: #94a3b8;
	}

	:global(.dark) .fe-password-toggle:hover,
	:global(html.dark) .fe-password-toggle:hover {
		color: #f1f5f9;
		background-color: rgba(255, 255, 255, 0.08);
	}
</style>
