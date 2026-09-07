<template>
	<!-- Docs: 
			https://vue-tel-input.iamstevendao.com/
			https://vuejsexamples.com/international-telephone-input-with-vue/ -->
	<div :class="wrapperClass">
		<div :class="containerClass">
        	<label :class="labelClass">{{ label }}</label>
	        <VueTelInput 
	        	:class="{ error: !isValid && phone.length != 0 }"
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
	import { computed, ref, watch } from 'vue'
	import { VueTelInput } from 'vue-tel-input'
	import 'vue-tel-input/dist/vue-tel-input.css'

	const props = defineProps({
		wrapperClass: { type: String, required: false, default: 'fe-mb' },
		containerClass: { type: String, required: false, default: 'fe-inline fe-w-full' },
		labelClass: { type: String, required: false, default: 'ml-2 text-sm font-medium text-gray-900 dark:text-white' },
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

	const phone = ref(String(props.defaultPhone ?? ''))

	// data() declaraba  dos veces y la segunda (undefined) pisaba a
	// la primera, asi que defaultCountry se ignoraba siempre.
	const country = ref(props.defaultCountry)

	const isValid = ref(false)

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
		id: '',
		maxlength: 12,
		name: 'telephone',
		showDialCode: false,
		placeholder: 'Ingresa un numero telefonico',
		readonly: false,
		required: false,
		tabindex: 0,
		type: 'tel',
		styleClasses: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
	}

	const mergedDropdownOptions = computed(() => ({ ...DROPDOWN_DEFAULTS, ...props.dropdownOptions }))

	const mergedInputOptions = computed(() => ({ ...INPUT_DEFAULTS, ...props.inputOptions }))

	// defaultPhone admite Number, y entonces .replace() reventaba.
	const extractDigits = (value) => String(value ?? '').replace(/\D/g, '')

	const validatePhone = (value) => extractDigits(value).length === 10

	const emitValue = () => {

		if (! validatePhone(phone.value)) {
			isValid.value = false
			return
		}

		isValid.value = true

		emit('change', {
			phone: extractDigits(phone.value),
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

<style scoped>
	.vue-tel-input.error:focus-within { 
		border: 3px solid #e5e5e5;
	    outline: none !important;
	    border-color: #ffd0d0;
    	box-shadow: 0 0 3px #ff6d6d;;
	}
	.vue-tel-input:focus-within {
	    box-shadow: none;
	    border-color: #66afe9;
	}
</style>