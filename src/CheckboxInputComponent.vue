<template>

	<div class="uk-margin">

        <label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">

            <input
                class="uk-checkbox"
                :class="customClass"
                type="checkbox"
                :name="name"
                :data-validators="validators"
                :value="val"
                v-model="value">

                {{ text }}

                <slot></slot>

        </label>

    </div>

</template>

<script setup>

	import { computed } from 'vue'

	const props = defineProps({
		customClass: {
			type: String,
			required: false,
			default: null
		},
		name: {
			type: String,
			required: true,
		},
		validators: {
			type: String,
			required: false,
			default: null
		},
		text: {
			type: String,
			required: false,
			default: ""
		},
		val: {
			type: String,
			required: false,
			default: null
		},
		modelValue: {
			default: ""
		}
	})

	const emit = defineEmits(['update:modelValue'])

	/**
	 * El getter devolvia `this.value`, es decir la propia computed: Vue corta
	 * la recursion y entregaba undefined, asi que la casilla nunca aparecia
	 * marcada a partir del valor enlazado. Solo funcionaba al reves, al
	 * marcarla a mano.
	 *
	 * Por eso existian tambien el data `checked` y su watcher, que intentaban
	 * compensarlo pero solo reaccionaban a los cambios posteriores al montaje
	 * y ademas competian con v-model por el mismo atributo. v-model ya
	 * gobierna el estado del control.
	 */
	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

</script>
