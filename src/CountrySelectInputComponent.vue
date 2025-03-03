<template>
	<!-- Docs: 
			https://vue-tel-input.iamstevendao.com/
			https://vuejsexamples.com/international-telephone-input-with-vue/ -->
	<div :class="wrapperClass">
		<div :class="containerClass">
        	<label :class="labelClass">{{ label }}</label>
	        <vue-tel-input 
	        	:class="{ error: !this.isValid && phone.length != 0 }"
	        	:default-country="defaultCountry"
	        	:dropdown-options="mergedDropdownOptions"
  				:input-options="mergedInputOptions"
	        	:preferredCountries="preferredCountries"
	        	:valid-characters-only="true"
	        	:disabled="disabled"
	        	@country-changed="countryChanged"
	        	@blur="blur"
	        	v-model="phone">
	        </vue-tel-input>
	    </div>
    </div>
</template>

<script>
	import { VueTelInput } from 'vue-tel-input';
  	import 'vue-tel-input/dist/vue-tel-input.css';
	export default {
		components: {
			VueTelInput 
		},
		props: {
			wrapperClass: {
				type: String,
				required: false,
				default: 'uk-margin'
			},
			containerClass: {
				type: String,
				required: false,
				default: 'uk-inline uk-width-1-1'
			},
			labelClass: {
				type: String,
				required: false,
				default: 'ml-2 text-sm font-medium text-gray-900 dark:text-white'
			},
			label: {
				type: String,
				required: false,
				default: ''
			},
			defaultPhone: {
				type: [String, Number],
				default: '',
			},
			defaultCountry: {
				type: [String, Number],
				default: null
			},	
			disabled: {
				type: Boolean,
				default: false,
			},
			dropdownOptions: {
				type: Object,
					default: {
	        		disabled: false,
					showDialCodeInList: false,
					showDialCodeInSelection: false,
					showFlags:true,
					showSearchBox: true,
					tabindex: 0,
					width: '100%'
	        	}
			},
			inputOptions: {
				type: Object,
				default: {
	        		autocomplete: 'on',
					autofocus: false,
					aria: '',
					id: '',
					maxlength: 12,
					name: 'telephone',
					showDialCode: false,
					placeholder: 'Ingresa un número telefónico',
					readonly: false,
					required: false,
					tabindex: 0,
					type:  'tel',
					styleClasses: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' ,
	        	}
			},
			preferredCountries: {
				type: Array,
				default: () => [/* Iso codes */]
			}
		},
		emits: ['change'],
		data() {
			return {
				phone: this.defaultPhone,
				country: this.defaultCountry,
				country: undefined,
				isValid: false,
			}
		},
		watch: {
			phone(val) {
				this.emitValue(val, this.country);
			},
			country(val) {
				this.emitValue(this.phone, val);
			},
			isValid(newVal, oldVal) {
				if(oldVal && !newVal) {
					this.$emit('change', {
						phone: this.phone,
						country: this.country,
						isValid: false,
					});
				}
			}
		},
		computed: {
			mergedDropdownOptions() {
				return {
				disabled: false,
				showDialCodeInList: false,
				showDialCodeInSelection: false,
				showFlags: true,
				showSearchBox: true,
				tabindex: 0,
				width: '100%',
				...this.dropdownOptions,  // Sobrescribe las propiedades definidas
				}
			},
			mergedInputOptions() {
				return {
				autocomplete: 'on',
				autofocus: false,
				aria: '',
				id: '',
				maxlength: 12,
				name: 'telephone',
				showDialCode: false,
				placeholder: 'Ingresa un número telefónico',
				readonly: false,
				required: false,
				tabindex: 0,
				type: 'tel',
				styleClasses: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
				...this.inputOptions,
				}
			}
		},
		methods: {
			emitValue(phone, country) {
				phone = phone.replace(/\s/g, "");
				if(this.validatePhone(phone)) {
					this.isValid = true;
					this.$emit('change', {
						phone: this.extractDigits(this.phone),
						country: country,
						isValid: true,
					});
				} else {
					this.isValid = false;
				}
			},
			countryChanged(val) {
				this.country = val;
			},
			blur() {
				if(!this.isValid) {
					this.phone = '';
					this.$emit('change', {
						phone: this.extractDigits(this.phone),
						country: this.country,
						isValid: false,
					});
				}
			},
			validatePhone(phone) {
				const digits = this.extractDigits(phone);
				console.log(digits);
				// Valida que el número tenga 10 dígitos, o ajusta según tu requerimiento
				return digits.length === 10;
			},
			extractDigits(phone) {
				return phone.replace(/\D/g, "");
			},
		}
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