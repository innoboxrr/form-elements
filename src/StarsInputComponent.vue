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

<script>

	export default {
    
	    props: {

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

	    },

	    emits: ['input', 'update:modelValue'],

	    computed: {

	    	value: {

				get() {
					return this.modelValue;
				},

				set(value){
					this.$emit('update:modelValue', value);
				}

			},
	       
	        ratingChars() {

	            return Array.from(this.char);

	        },
	       
	        inactiveRatingChars() {

	            /* Default to ratingChars if no inactive characters have been provided */
	            return this.inactiveChar ? Array.from(this.inactiveChar) : this.ratingChars;

	        },
	        
	        notouch() {

	            /* For iPhone specifically but really any touch device, there is no true hover state, disables any pseudo-hover activity. */
	            return typeof document !== "undefined" && !("ontouchstart" in document.documentElement);

	        },
	        
	        mapCssProps() {

	            var result = {};

	            if (this.activeColor)
	                result["--active-color"] = this.activeColor;

	            if (this.inactiveColor)
	                result["--inactive-color"] = this.inactiveColor;

	            if (this.shadowColor)
	                result["--shadow-color"] = this.shadowColor;

	            if (this.hoverColor)
	                result["--hover-color"] = this.hoverColor;

	            result["--stars-size"] = this.starsSize;

	            return result;

	        },

	    },

	    methods: {
	    
	        updateInput(v) {

	            this.$emit("input", parseInt(v, 10));

	        },
	    
	        getActiveLabel(x) {

	            var s = this.ratingChars;
	            return s[Math.min(s.length - 1, x - 1)];

	        },
	    
	        getInactiveLabel(x) {

	            var s = this.inactiveRatingChars;
	            return s[Math.min(s.length - 1, x - 1)];

	        },
	    
	    },

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