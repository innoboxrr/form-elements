<template>

	<!-- Docs: 
			https://vue-tel-input.iamstevendao.com/
			https://vuejsexamples.com/international-telephone-input-with-vue/ -->
	
	<div class="uk-margin">

        <vue-tel-input 
        	:class="{ error: !this.isValid && phone.length != 0 }"
        	:default-country="defaultCountry"
        	:dropdown-options="dropdownOptions"
        	:input-options="inputOptions"
        	:preferredCountries="[/* iso codes */]"
        	:valid-characters-only="true"
        	@country-changed="countryChanged"
        	@blur="blur"
        	v-model="phone">
        </vue-tel-input>

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

			defaultPhone: {
				type: [String, Number],
				default: '',
			},

			defaultCountry: {
				type: String,
				default: null
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
					required: true,
					tabindex: 0,
					type:  'tel',
					styleClasses: 'uk-input uk-form-large uk-border-rounded' ,
	        	}
			},

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

		methods: {

			emitValue(phone, country) {

				phone = phone.replace(/\s/g, "");

				if(this.validatePhone(phone)) {

					this.isValid = true;

					this.$emit('change', {
						phone: phone,
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
						phone: this.phone,
						country: this.country,
						isValid: false,
					});

				}

			},

			validatePhone(phone) {

				let a = phone.length == 10;

				let b = Number.isInteger(Number(phone));

				return a && b;

			}

		}

	}

</script>

<style scoped>
	

	.vue-tel-input.error:focus-within { 
		border: 1px solid #e5e5e5;
	    outline: none !important;
	    border-color: #ffd0d0;
    	box-shadow: 0 0 3px #ff6d6d;;
	}

</style>