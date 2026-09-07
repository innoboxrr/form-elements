<template>
	
	<label class="fe-switch">

      <input type="checkbox" v-model="value" @change="emit('change', $event)">

      <div class="fe-switch-slider fe-switch-lg"></div>

    </label>

</template>

<script setup>

	import { computed } from 'vue'

	const props = defineProps({
		modelValue: {
			default: null
		}
	})

	const emit = defineEmits(['update:modelValue', 'change'])

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

</script>

<style scoped>
	
	.fe-switch {
		position: relative;
		display: inline-block;
		height: 19px;
		width: 30px;
	}

	/* Hide default HTML checkbox */
	.fe-switch input {
		display:none;
	}

	/* Slider */
	.fe-switch-slider {
		background-color: rgba(0,0,0,0.22);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		border-radius: 500px;
		bottom: 0;
		cursor: pointer;
		transition-property: background-color;
		transition-duration: .2s;
		box-shadow: inset 0 0 2px rgba(0,0,0,0.07);
	}
	
	/* Switch pointer */
	.fe-switch-slider:before {
		content: '';
		background-color: #fff;
		position: absolute;
		width: 15px;
		height: 15px;
		left: 2px;
		bottom: 2px;
		border-radius: 50%;
		transition-property: transform, box-shadow;
		transition-duration: .2s;
	}

	/* Slider active color */
	input:checked + .fe-switch-slider {
		background-color: #39f !important;
	}

	/* Pointer active animation */
	input:checked + .fe-switch-slider:before {
		transform: translateX(13px);
	}

	/* Style Modifier */
	.fe-switch-slider.fe-switch-lg:before {
		transform: scale(1.2);
		box-shadow: 0 0 6px rgba(0,0,0,0.22);
	}

	input:checked + .fe-switch-slider.fe-switch-lg:before {
		transform: translateX(13px) scale(1.2);
	}

</style>