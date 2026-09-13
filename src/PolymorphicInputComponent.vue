<template>
	
	<div>

		<div class="fe-grid-sm" fe-grid>
			
			<div class="fe-w-expand">
				
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
					
					<div class="fe-mb"><label class="">{{ props.label }}</label></div>

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
			            <option value="" selected disabled>{{ props.placeholder || 'Selecciona una opción' }}</option>
			            <option 
			            	v-for="option in props.options"
			            	:key="option"
			            	:value="option">{{ option }}</option>
			        </select-input-component>

				</div>

				<div v-if="props.type == 'checkbox'">
					
					<div class="fe-mb"><label class="">{{ props.label }}</label></div>

					<multi-checkbox-input-component 
						:id="id"
						:options="optionsKeyPair(props.options)" 
						:value="stringToArray(value)"
						@update:value="checkboxSubmit" />

				</div>

				<div v-if="props.type == 'file'">
					
					<div class="fe-mb">

						<label class="">{{ props.label }}</label>

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
				class="fe-w-auto fe-flex fe-justify-center fe-items-center">

				<IconComponent
					name="save"
					:size="24"
					custom-class="fe-text-success pointer"
					@click="saveResponse" />

			</div>

		</div>

	</div>

</template>

<script setup>

	import { computed, ref, useId } from 'vue'
	import IconComponent from './IconComponent.vue'

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

	const componentProps = defineProps({

		// El nombre del prop es literalmente "props"; se conserva por
		// compatibilidad con quien ya lo usa.
		props: {
			type: Object,
			required: true
		},

		modelValue: {
			default: ""
		}

	})

	const emit = defineEmits(['update:modelValue', 'input', 'enter', 'focus', 'blur', 'save'])

	// Antes se generaba con la global chance.hash(), que obligaba a que la
	// aplicacion anfitriona la pusiera en window.
	const id = useId()

	const data = ref(undefined)

	const showSaveButton = ref(false)

	const value = computed({

		get: () => componentProps.modelValue,

		set: (newValue) => {

			showSaveButton.value = true
			data.value = newValue

			emit('update:modelValue', newValue)

		},

	})

	const optionsKeyPair = (options) => options.map((option) => ({ id: option, name: option }))

	const stringToArray = (value) => value ? JSON.parse(value) : []

	const uploadFile = (files) => {
		value.value = files[0].id
	}

	const checkboxSubmit = (payload) => emit('save', payload)

	const saveResponse = () => {

		showSaveButton.value = false

		emit('save', data.value)

	}

</script>