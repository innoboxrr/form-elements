<template>

	<div 
		ref="ratingEl" 
		class="vue-stars pointer" 
		:class="{ readonly: readonly, notouch: notouch }" 
		:style="mapCssProps">

		<input 
			:id="name + '0'" 
			:checked="modelValue === 0" 
			:name="name" 
			type="radio" 
			value="0" 
			v-model="value"/>
		
		<template v-for="x in max" :key="'i' + x">
		
			<label :for="name + x">
		
				<span class="active">
		
					<slot name="activeLabel">{{ getActiveLabel(x) }}</slot>
		
				</span>
		
				<span class="inactive">
		
					<slot name="inactiveLabel">{{ getInactiveLabel(x) }}</slot>
		
				</span>
		
			</label>
		
			<input 
				:id="name + x" 
				:checked="modelValue === x" 
				:name="name" 
				:disabled="readonly" 
				:value="x" 
				type="radio" 
				@change="updateInput($event.target.value)" 
				v-model="value"/>

		</template>

	</div>

</template>

<script setup>

	import { computed } from 'vue'

	const props = defineProps({

	    max: {
	    	type: Number,
	    	required: false,
	    	default: 5
	    },

	    modelValue: {
	    	type: Number,
	    	required: false,
	    	default: 0
	    },

	    name: {
	    	type: String,
	    	required: false,
	    	default: "rating"
	    },

	    char: {
	    	type: String,
	    	required: false,
	    	default: "★"
	    },

	    inactiveChar: {
	    	type: String,
	    	required: false,
	    	default: null
	    },

	    readonly: {
	    	type: Boolean,
	    	required: false,
	    	default: false
	    },

	    activeColor: {
	    	type: String,
	    	required: false,
	    	default: null
	    },

	    inactiveColor: {
	    	type: String,
	    	required: false,
	    	default: null
	    },

	    shadowColor: {
	    	type: String,
	    	required: false,
	    	default: null
	    },

	    hoverColor: {
	    	type: String,
	    	required: false,
	    	default: null
	    },

	    starsSize: {
	    	type: String,
	    	required: false,
	    	default: '50px',
	    }

	})

	const emit = defineEmits(['input', 'update:modelValue'])

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

	const ratingChars = computed(() => Array.from(props.char))

	/* Default to ratingChars if no inactive characters have been provided */
	const inactiveRatingChars = computed(
		() => props.inactiveChar ? Array.from(props.inactiveChar) : ratingChars.value
	)

	/* En un dispositivo tactil no hay hover real: desactiva el pseudo-hover. */
	const notouch = computed(
		() => typeof document !== "undefined" && ! ("ontouchstart" in document.documentElement)
	)

	const mapCssProps = computed(() => {

		const result = {}

		if (props.activeColor) result["--active-color"] = props.activeColor
		if (props.inactiveColor) result["--inactive-color"] = props.inactiveColor
		if (props.shadowColor) result["--shadow-color"] = props.shadowColor
		if (props.hoverColor) result["--hover-color"] = props.hoverColor

		result["--stars-size"] = props.starsSize

		return result

	})

	const updateInput = (v) => emit("input", parseInt(v, 10))

	const getActiveLabel = (x) => {
		const chars = ratingChars.value

		return chars[Math.min(chars.length - 1, x - 1)]
	}

	const getInactiveLabel = (x) => {
		const chars = inactiveRatingChars.value

		return chars[Math.min(chars.length - 1, x - 1)]
	}

</script>

<style scoped>

	.vue-stars {
		display: inline-flex;
		flex-flow: row nowrap;
		align-items: flex-start center;
		line-height: 1em;
		font-size: var(--stars-size, 50px);
	}

	.vue-stars label {
		display: block;
		padding: 0.125em;
		width: 1.2em;
		text-align: center;
		color: var(--active-color, #fd0);
		text-shadow: 0 0 0.2em var(--shadow-color, #ff0);
	}

	.vue-stars input,
	.vue-stars label .inactive,
	.vue-stars input:checked ~ label .active,
	.vue-stars.notouch:not(.readonly):hover label .inactive,
	.vue-stars.notouch:not(.readonly) label:hover ~ label .active {
		display: none;
	}

	.vue-stars input:checked ~ label .inactive,
	.vue-stars.notouch:not(.readonly):hover label .active,
	.vue-stars.notouch:not(.readonly) label:hover ~ label .inactive {
		display: inline;
	}

	.vue-stars.notouch:not(.readonly):hover label {
		color: var(--hover-color, #dd0);
		text-shadow: 0 0 0.2em var(--shadow-color, #ff0);
	}

	.vue-stars input:checked ~ label,
	.vue-stars.notouch:not(.readonly) label:hover ~ label {
		color: var(--inactive-color, #999);
		text-shadow: none;
	}

</style>