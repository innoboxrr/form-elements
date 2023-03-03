<template>
	
	<div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

        	<label class="uk-form-label">{{ label }}</label>

            <textarea
            	class="uk-textarea uk-form-large uk-border-rounded" 
            	:class="customClass"
            	:rows="rows" 
            	:name="name"
            	:placeholder="placeholder"
            	:data-validators="validators"
            	:data-min_length="min_length"
            	:data-max_length="max_length"
            	v-model="value"></textarea>

        </div>

    </div>

</template>

<script>
	
	export default {

		props: {
			label: {
				type: String,
				required: false,
				default: ''
			},
			customClass: {
				type: String,
				required: false,
			},
			rows: {
				type: Number,
				default: 5
			},
			name: {
				type: String,
				required: true
			},
			placeholder: {
				type: String,
				required: false
			},
			validators: {
				type: String,
				required: false,
			},
			min_length: {
				type: String,
				required: false,
			},
			max_length: {
				type: String,
				required: false,
			},
			modelValue: {
				type: String,
				default: ""
			}
		},

		emits: ['update:modelValue'],

		computed: {

			value: {

				get() {
					return this.modelValue;
				},

				set(value){
					this.$emit('update:modelValue', value);
				}

			}

		}

	}

</script>