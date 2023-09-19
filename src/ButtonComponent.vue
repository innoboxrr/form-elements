<template>
	
	<div class="uk-margin">

        <button 
            :class="customClass"
            :disabled="disabled">

            {{ value }}
            
        </button>

    </div>

</template>

<script>
	
	export default {

		props: {
			customClass: {
				type: String,
				required: false,
				default: "uk-button uk-width-1-1 button"
			},
			disabled: {
				type: Boolean,
				required: false,
				default: false,
			},
			value: {
				type: String,
				required: true,
				default: "Enviar"
			}
		}

	}

</script>