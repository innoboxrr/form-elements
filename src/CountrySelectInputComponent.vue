<template>
	<!-- Docs: https://vue-tel-input.iamstevendao.com/ -->
	<div :class="wrapperClass ?? fieldClass">
		<label v-if="label" :for="inputId" :class="labelClass ?? labelThemeClass">{{ label }}</label>
		<div :class="containerClass ?? fieldInnerClass">
			<VueTelInput
				:class="[phoneClass, { [phoneInvalidClass]: invalid }]"
				:default-country="defaultCountry"
				:dropdown-options="mergedDropdownOptions"
				:input-options="mergedInputOptions"
				:preferredCountries="preferredCountries"
				:valid-characters-only="true"
				:disabled="disabled"
				@country-changed="countryChanged"
				@blur="blur"
				v-model="phone">
			</VueTelInput>
		</div>
	</div>
</template>

<script setup>
	/**
	 * Teléfono con selector de país, sobre vue-tel-input.
	 *
	 * Lo que emite `change` no cambia: `{ phone, country, isValid }`, con
	 * `country` tal como lo da vue-tel-input (`dialCode`, `name`, `iso2`). Hay
	 * formularios que guardan exactamente eso.
	 *
	 * La validez la decide libphonenumber según el país elegido, igual que en
	 * React. Antes valía cualquier número de 10 dígitos: un móvil español (9)
	 * no se podía guardar y un número mexicano imposible sí. `phone` sigue
	 * siendo el número nacional en dígitos, sin prefijo.
	 *
	 * El aspecto sale del tema (`phone`, `phoneInvalid`). Antes el campo llevaba
	 * clases de Tailwind y colores escritos en su estilo, así que fuera de una
	 * aplicación con Tailwind salía sin forma y en oscuro no se leía.
	 */
	import { computed, ref, useId, watch } from 'vue'
	import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js'
	import { VueTelInput } from 'vue-tel-input'
	import 'vue-tel-input/dist/vue-tel-input.css'
	import { useThemeClass } from './composables/useTheme.js'

	const props = defineProps({
		// Sin valor, cada una sale de su token del tema.
		wrapperClass: { type: String, default: null },
		containerClass: { type: String, default: null },
		labelClass: { type: String, default: null },
		label: { type: String, required: false, default: '' },
		defaultPhone: { type: [String, Number], default: '' },
		defaultCountry: { type: [String, Number], default: null },
		disabled: { type: Boolean, default: false },
		// Vue 3 exige factoria en los defaults de objeto.
		dropdownOptions: { type: Object, default: () => ({}) },
		inputOptions: { type: Object, default: () => ({}) },
		preferredCountries: { type: Array, default: () => [] }
	})

	const emit = defineEmits(['change'])

	const fieldClass = useThemeClass('field')
	const fieldInnerClass = useThemeClass('fieldInner')
	const labelThemeClass = useThemeClass('label')
	const phoneClass = useThemeClass('phone')
	const phoneInvalidClass = useThemeClass('phoneInvalid')

	// La etiqueta apunta al campo: sin id, pulsarla no lo enfocaba.
	const generatedId = useId()
	const inputId = computed(() => props.inputOptions.id || `phone-${generatedId}`)

	const phone = ref(String(props.defaultPhone ?? ''))

	// data() declaraba  dos veces y la segunda (undefined) pisaba a
	// la primera, asi que defaultCountry se ignoraba siempre.
	const country = ref(props.defaultCountry)

	const isValid = ref(false)

	const invalid = computed(() => ! isValid.value && phone.value.length !== 0)

	const DROPDOWN_DEFAULTS = {
		disabled: false,
		showDialCodeInList: false,
		showDialCodeInSelection: false,
		showFlags: true,
		showSearchBox: true,
		tabindex: 0,
		width: '100%',
	}

	const INPUT_DEFAULTS = {
		autocomplete: 'on',
		autofocus: false,
		aria: '',
		// Con 12 no cabía un número formateado de países con más dígitos.
		maxlength: 20,
		name: 'telephone',
		showDialCode: false,
		placeholder: 'Ingresa un número telefónico',
		readonly: false,
		required: false,
		tabindex: 0,
		type: 'tel',
		styleClasses: '',
	}

	const mergedDropdownOptions = computed(() => ({ ...DROPDOWN_DEFAULTS, ...props.dropdownOptions }))

	const mergedInputOptions = computed(() => ({ ...INPUT_DEFAULTS, ...props.inputOptions, id: inputId.value }))

	// defaultPhone admite Number, y entonces .replace() reventaba.
	const extractDigits = (value) => String(value ?? '').replace(/\D/g, '')

	// vue-tel-input da el país como objeto; defaultCountry puede ser el iso2.
	const iso2Of = (value) => String((typeof value === 'object' ? value?.iso2 : value) ?? '').toUpperCase() || undefined

	const nationalNumber = (value) => {
		const iso2 = iso2Of(country.value)

		try {
			return isValidPhoneNumber(String(value ?? ''), iso2)
				? parsePhoneNumber(String(value), iso2).nationalNumber
				: null
		} catch {
			return null
		}
	}

	const emitValue = () => {

		const national = nationalNumber(phone.value)

		if (national === null) {
			isValid.value = false
			return
		}

		isValid.value = true

		emit('change', {
			phone: national,
			country: country.value,
			isValid: true,
		})

	}

	watch(phone, emitValue)
	watch(country, emitValue)

	watch(isValid, (value, previous) => {
		if (previous && ! value) {
			emit('change', { phone: phone.value, country: country.value, isValid: false })
		}
	})

	const countryChanged = (value) => {
		country.value = value
	}

	const blur = () => {

		if (isValid.value) {
			return
		}

		phone.value = ''

		emit('change', { phone: '', country: country.value, isValid: false })

	}
</script>
