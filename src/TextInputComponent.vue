<template>
	
	<div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

        	<label class="uk-form-label">{{ label }}</label>

            <span 
            	v-if="hasIcon"
            	class="uk-form-icon" 
            	:uk-icon="iconAttr"></span>

            <input 
            	:data-uid="uid"
            	class="uk-input uk-form-large uk-border-rounded" 
            	:class="customClass"
            	:type="type" 
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
            	@keyup.enter="$emit('enter', $event)"
            	@input="$emit('input', $event)"
            	@focus="$emit('focus', $event)"
            	@blur="$emit('blur', $event)"
            	v-model="value">

        </div>

    </div>

</template>

<script>

	import { formatDirective } from 'innoboxrr-maskjs'
	
	export default {

		props: {
			label: {
				type: String,
				required: false,
				default: ''
			},
			icon: {
				type: String,
				required: false,
				default: ""
			},
			customClass: {
				type: String,
				required: false,
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
				required: false
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
			},
			min_length: {
				type: [String, Number],
				required: false,
			},
			max_length: {
				type: [String, Number],
				required: false,
			},
			steps:{
				type: [String, Number],
				default: null
			},
			readonly: {
				type: Boolean,
				default: null
			},
			maskFormat:{
				type: Object,
				default: {},
			},
			modelValue: {
				default: ""
			}
		},

		emits: ['update:modelValue', 'enter', 'focus', 'blur', 'input'],

		directives: {

			format: formatDirective

		},

		data() {

			return {

				uid: chance.hash(),

			}

		},

		computed: {

			value: {

				get() {
					return this.modelValue;
				},

				set(value){
					
					this.$emit('update:modelValue', value);

				}

			},

			hasIcon() {

				return (this.icon == "" || this.icon == null) ? false : true;

			},

			iconAttr() {

				return (this.icon == "") ? "" : `icon: ${this.icon}`;

			}

		}

	}

</script>