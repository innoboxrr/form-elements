<template>
	
	<div class="uk-margin">

		<div v-if="showEditor">
			
			<editor-input-component
	            :id="id + '_TESMI_Editor'"
	            :label="label"
	            :name="name"
	            :disabled="disabled"
	            :initial-value="initialValue"
	            :inline="inline"
	            :output="output"
	            :file="file"
	            :height="height"
	            :plugins="plugins"
	            :toolbar="toolbar"
	            :menubar="menubar"
	            v-model="value" />

		</div>

		<div v-else>

			<div uk-grid>

				<div class="uk-width-expand">
					
					<textarea 
						:id="id" 
						class="ui-autocomplete-input" 
						:class="customClass"
						:placeholder="placeholder"
						:name="name"
						autocomplete="off" 
						role="textbox" 
						aria-autocomplete="list" 
						aria-haspopup="true"
						:data-validators="validators"
		            	:data-min_length="min_length"
		            	:data-max_length="max_length"
		            	v-model="value"></textarea>

				</div>

			</div>

        </div>

        <!-- Show/Hide Editor -->
        <label>

			<input 
				class="uk-checkbox" 
				type="checkbox" 
				v-model="showEditor">

			<span class="uk-text-small uk-text-meta">

				&nbsp; Editor HTML

			</span>

		</label>

		<speech-recognition 	
			v-if="showSpeechRecognition"
			@onTranscriptionEnd="onTranscriptionEnd" />

	</div>

</template>

<script>
	
	import EditorInputComponent from '@components/forms/EditorInputComponent'
	import SpeechRecognition from '@components/plugins/speech_recognition/SpeechRecognition'

	export default {

		components: {

			EditorInputComponent,

			SpeechRecognition

		},

		props: {

			// Common props

				label: {
					type: String,
					required: false,
					default: ''
				},

				name: {
					type: String,
					required: true
				},

				defaultShowEditor: {
					type: Boolean,
					default: false,
				},

				showSpeechRecognition: {
					type: Boolean,
					default: true
				},

			// Textarea props

				customClass: {
					type: String,
					required: false,
				},
				
				placeholder: {
					type: String,
					required: false,
					default: 'Comienza a escribir aquí...'
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

			// Editor props

				id: {
					type: String,
					default: 'tmce'
				},

				disabled: { // Habilita o deshabilita el editor
					type: Boolean,
					default: false,
				},
				
				initialValue: { // Colocar valor inicial del editor
					type: String,
					default: ''
				},
				
				inline: { // Modo de editor
					type: Boolean,
					default: false,
				},
				
				output: { // Formato de salida de texto
					type: String,
					default: 'html' // html, text
				},
				
				file: {
					type: Boolean,
					default: false
				},
				
				height: {
					type: Number,
					default: 200
				},

				plugins:{
					type: Array,
					default: [
		                "advlist autolink lists link image charmap print preview hr anchor pagebreak",
		                "searchreplace wordcount visualblocks visualchars code fullscreen",
		                "insertdatetime media nonbreaking table directionality",
		                "template paste textpattern codesample"
		            ]      
				},

				toolbar: {
					type: String,
					default: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media codesample | fullscreen",
				},

				menubar: {
					type: Boolean,
					default: true
				},

			// Binding
			
				modelValue: {
					type: String,
					default: ""
				}
		
		},

		emits: ['update:modelValue'],

		data() {

			return {

				showEditor: this.defaultShowEditor,

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

		},

		methods: {

			onTranscriptionEnd(data) {

				let str = data.lastSentence[0].toLowerCase() + data.lastSentence.slice(1) + ' ';

				this.value += ' ' + str;

			}

		}

	}

</script>

<style scoped>
	
	.ui-autocomplete-input {
		height: 40px;
	    width: calc(100% - 18px);
	    -moz-border-bottom-colors: none;
	    -moz-border-left-colors: none;
	    -moz-border-right-colors: none;
	    -moz-border-top-colors: none;
	    background: none repeat scroll 0 0 #f0f2f5;
	    -o-border-image: none;
	    border-radius: 6px 6px 6px 6px;
	    border-style: none;
	    color: #555555;
	    font-size: 1em;
	    line-height: 1.4em;
	    padding: 5px 8px;
	    transition: height 0.2s ease 0.2s;
	}

	.ui-autocomplete-input:focus {
		height: 100px;
		outline-width: 0;
	}

</style>