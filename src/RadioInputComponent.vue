<template>
	
	<div class="uk-margin">
        <label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
            <input 
                class="uk-radio" 
                :class="customClass"
                type="radio"
                :checked="checked" 
                :name="name"
                :data-validators="validators"
                :value="val"
                v-model="value">
                
                {{ text }}
                
                <slot></slot>

        </label>
    </div>

</template>

<script>
	
	export default {

		props: {
			
			customClass: {
				type: String,
				required: false
			},
			
			name: {
				type: String,
				required: true,
			},
			
			validators: {
				type: String,
				required: false,
			},
			
			text: {
				type: String,
				required: false,
				default: ""
			},
			
			val: {
				type: String,
				required: true,
			},
			
			modelValue: {
				default: ""
			},
			
			checked: {
				type: Boolean,
				default: false,
			}

		},

		emits: ['update:modelValue'],

		computed: {

			value: {

				get() {
					
					return this.value;

				},

				set(value) {
					
					this.$emit('update:modelValue', value)

				}

			}

		},

	}

</script>