<template>
	
	<div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

        	<label class=" ml-2 text-sm font-medium text-gray-900 dark:text-white">
				<span v-if="help" class="cursor-pointer">
					<i :uk-tooltip="`title: ${help}`" class="fa-solid fa-circle-question"></i>
				</span>
				{{ label }}
			</label> 

            <span 
            	v-if="hasIcon"
            	class="uk-form-icon" 
            	:uk-icon="iconAttr"></span>

            <input 
            	:data-uid="uid" 
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
				@paste="handlePaste"
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
				default: 'uk-input uk-form-large uk-border-rounded'
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
			},
			enablePasteList: {
				type: Boolean,
				default: false
			}
		},

		emits: ['update:modelValue', 'enter', 'focus', 'blur', 'input', 'paste-list'],

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
		},
		methods: {
			handlePaste(event) {
				const clipboardData = event.clipboardData || window.clipboardData;
				const pastedText = clipboardData.getData('text');

				const delimiter = pastedText.includes('\n') ? '\n' : ',';
				const items = pastedText.split(delimiter).map(i => i.trim()).filter(Boolean);

				if (items.length > 1 && this.enablePasteList) {
					event.preventDefault(); 
					this.$emit('paste-list', items);
				}
			}
		}
	}
</script>