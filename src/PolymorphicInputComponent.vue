<template>
	
	<div>

		<div class="uk-grid-small" uk-grid>
			
			<div class="uk-width-expand">
				
				<div v-if="['text', 'number', 'date', 'time', 'url', 'email'].includes(props.type)">
					
					<text-input-component 
						:label="props.label" 
						:icon="props.icon"
						:custom-class="props.customClass"
						:type="props.type"
						:name="props.name"
						:placeholder="props.placeholder"
						:validators="props.validators" 
						:min_length="props.minLength"
						:max_length="props.maxLength" 
						:readonly="props.readonly" 
						v-model="value" 
						@enter="$emit('enter', $event)" 
						@input="$emit('input', $event)"
						@focus="$emit('focus', $event)"
						@blur="$emit('blur', $event)" />

				</div>

				<div v-if="props.type == 'textarea'">
					
					<textarea-input-component 
						:label="props.label" 
						:custom-class="props.customClass"
						:name="props.name"
						:placeholder="props.placeholder"
						:validators="props.validators" 
						:min_length="props.minLength"
						:max_length="props.maxLength" 
						v-model="value" />

				</div>

				<div v-if="props.type == 'radio'">
					
					<div class="uk-margin"><label class="uk-form-label">{{ props.label }}</label></div>

					<div v-for="option in props.options">
						
						<radio-input-component 
							:custom-class="props.customClass"
							:name="props.name"
							:validators="props.validators" 
							:text="option"
							:val="option"
							:checked="option == value"
							v-model="value" />

					</div>

				</div>

				<div v-if="props.type == 'select'">

			        <select-input-component
			            :custom-class="props.customClass"
			            :name="props.name"
			            :label="props.label" 
			            :validators="props.validators" 
			            v-model="value">
			            <option value="" selected disabled>Selecciona una opción</option>        
			            <option 
			            	v-for="option in props.options"
			            	:key="option"
			            	:value="option">{{ option }}</option>
			        </select-input-component>

				</div>

				<div v-if="props.type == 'checkbox'">
					
					<div class="uk-margin"><label class="uk-form-label">{{ props.label }}</label></div>

					<multi-checkbox-input-component 
						:id="id"
						:options="optionsKeyPair(props.options)" 
						:value="stringToArray(value)"
						@update:value="checkboxSubmit" />

				</div>

				<div v-if="props.type == 'file'">
					
					<div class="uk-margin">

						<label class="uk-form-label">{{ props.label }}</label>

					</div>

					<file-input-component 
			            message="Arrastre y suelte los archivos a subir aquí"
			            :show-top-preview="true"
			            :auto-upload="true"
			            :hide-on-max-files-reached="true"
			            @updateFileList="uploadFile"/>

				</div>

			</div>

			<div 
				v-if="showSaveButton" 
				class="uk-width-auto uk-flex uk-flex-center uk-flex-middle">

				<i 
					class="far fa-save fa-lg uk-text-success pointer" 
					@click="saveResponse"></i>

			</div>

		</div>

	</div>

</template>

<script>
		
	import CheckboxInputComponent from './CheckboxInputComponent.vue'
	import SingleCheckboxInputComponent from './SingleCheckboxInputComponent.vue'
	import MultiCheckboxInputComponent from './MultiCheckboxInputComponent.vue'
	import EditorInputComponent from './EditorInputComponent.vue'
	import FileInputComponent from './FileInputComponent.vue'
	import RadioInputComponent from './RadioInputComponent.vue'
	import SelectInputComponent from './SelectInputComponent.vue'
	import SimpleFileInputComponent from './SimpleFileInputComponent.vue'
	import StarsInputComponent from './StarsInputComponent.vue'
	import SwitchComponent from './SwitchComponent.vue'
	import TextareaInputComponent from './TextareaInputComponent.vue'
	import TextInputComponent from './TextInputComponent.vue'

	export default {

		components: {

			TextInputComponent,

			CheckboxInputComponent,

			SingleCheckboxInputComponent,

			MultiCheckboxInputComponent,

			EditorInputComponent,

			FileInputComponent,

			RadioInputComponent,

			SelectInputComponent,

			SimpleFileInputComponent,

			StarsInputComponent,

			SwitchComponent,

			TextareaInputComponent,

		},

		props: {

			props: {
				type: Object,
				required: true
			},

			modelValue: {
				default: ""
			}

		},

		emits: ['update:modelValue', 'input', 'enter', 'focus', 'blur', 'save'],

		data() {

			return {

				id: chance.hash(),

				data: undefined,

				showSaveButton: false,

			}

		},

		computed: {

			value: {

				get() {
					
					return this.modelValue;

				},

				set(value){

					this.showSaveButton = true;

					this.data = value;

					this.$emit('update:modelValue', value);

				}

			},

		},

		methods: {

			optionsKeyPair(options) {

				return options.map(option => {

					return {id: option, name: option}

				});

			},

			stringToArray(value) {

				if(value) {

					return  JSON.parse(value);

				} else {

					return [];

				}

			},

			uploadFile(data) {

				this.value = data[0].id;

			},

			checkboxSubmit(data) {

				this.$emit('save', data);

			},

			saveResponse() {

				this.showSaveButton = false;

				this.$emit('save', this.data);

			},

		}

	}

</script>