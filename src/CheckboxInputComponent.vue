<template>
	
	<div class="uk-margin">
        <label>
            <input 
                class="uk-checkbox" 
                :class="customClass"
                type="checkbox"
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
				required: false,
			},
			modelValue: {
				default: ""
			}
		},

		emits: ['update:modelValue'],

		data() {

			return {

				checked: false,

			}

		},

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

		watch: {

			modelValue(value) {

				if(value == 1) {

					this.checked = true;

				}else {

					this.checked = null;

				}

			}

		}

	}

</script>