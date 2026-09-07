<template>
	
	<div class="fe-mb">

        <div class="fe-inline fe-w-full">

        	<label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
				<span v-if="help" class="cursor-pointer">
					<i :uk-tooltip="`title: ${help}`" class="fa-solid fa-circle-question"></i>
				</span>
				{{ label }}
			</label>

			<speech-recognition 
            	v-if="showSpeechRecognition"
				@onTranscriptionEnd="onTranscriptionEnd" />

            <editor 
            	:id="id"
            	:name="name"
            	:init="config"
            	:disabled="disabled"
            	:initial-value="initialValue"
            	:inline="inline"
            	:output-format="output"
            	:tinymce-script-src="tinyCDN"
            	class="editor" 
            	v-model="value" />

        </div>

    </div>

</template>

<script setup>

    import { computed } from 'vue'
    import Editor from '@tinymce/tinymce-vue'
    import SpeechRecognition from './components/SpeechRecognition.vue'

	const props = defineProps({

		help: {
			type: String,
			required: false,
			default: null
		},

		uploadUrl: {
			type: String,
			default: null, // Requerido solo si se suben archivos
		},

		uri: {
			type: String,
			default: '/'
		},

		label: {
			type: String,
			required: false,
			default: ''
		},

		id: {
			type:String,
			required: true,
		},

		name: {
			type: String,
			required: true
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

		tinymceCdn: {
			type: String,
			default: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.3.2/tinymce.min.js'
		},

		file: {
			type: Boolean,
			default: false
		},

		height: {
			type: Number,
			default: 400
		},

		plugins:{
			type: String,
			default: "advlist autolink lists link image charmap preview anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking table directionality template codesample"
		},

		toolbar: {
			type: String,
			default: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media codesample | fullscreen",
		},

		menubar: {
			type: Boolean,
			default: true
		},

		showSpeechRecognition: {
			type: Boolean,
			default: false,
		},

		modelValue: {
			type: String,
			default: ""
		},

		/**
		 * Estaba declarado como `default: () => {}`, que en JavaScript es una
		 * arrow con cuerpo de bloque vacio: devuelve undefined, no un objeto.
		 */
		extraConfig: {
			type: Object,
			default: () => ({})
		},

		onFileUploadSuccess:{
			type: Function,
			default: null
		}

	})

	const emit = defineEmits(['update:modelValue'])

	// data() hacia `this.localTinyMceCdn ?? this.tinymceCdn`, pero
	// localTinyMceCdn no existia como prop ni como dato: siempre undefined.
	const tinyCDN = computed(() => props.tinymceCdn)

	const value = computed({
		get: () => props.modelValue,
		set: (newValue) => emit('update:modelValue', newValue),
	})

	const isDarkMode = computed(() => document.body.classList.contains('dark'))

	const csrfToken = () => globalThis.csrf_token
		?? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
		?? ''

	const notifyError = (message) => {
		// UIkit lo aporta la aplicacion anfitriona.
		globalThis.UIkit?.notification({ message, status: 'danger' })
	}

	const focusFirstFieldOfDialog = () => {

		const tryFocus = () => {

			const firstElement = document.querySelector('.tox-form input, .tox-form textarea, .tox-form select')

			if (firstElement) {
				firstElement.focus()

				return true
			}

			return false

		}

		if (tryFocus()) {
			return
		}

		let attempts = 10

		const interval = setInterval(() => {
			if (tryFocus() || --attempts <= 0) {
				clearInterval(interval)
			}
		}, 50)

	}

	/**
	 * Era `function (editor)`, asi que dentro `this` era el editor de TinyMCE
	 * y no el componente: el gancho `extraConfig.setup` nunca se ejecutaba.
	 */
	const setup = (editor) => {

		editor.on('OpenWindow', focusFirstFieldOfDialog)

		if (typeof props.extraConfig?.setup === 'function') {
			props.extraConfig.setup(editor)
		}

	}

	const filePickerCallback = (callback, value, meta) => {

		const input = document.createElement('input')

		input.setAttribute('name', 'file')
		input.setAttribute('type', 'file')
		input.setAttribute('style', 'display:none;')

		document.body.appendChild(input)

		input.click()

		input.onchange = () => {

			const formData = new FormData()

			formData.append('_token', csrfToken())
			formData.append('file', input.files[0])
			formData.append('visibility', 'public')

			fetch(props.uploadUrl, { method: 'POST', body: formData })
				.then((response) => {

					if (! response.ok) {
						throw new Error('An error has occurred')
					}

					return response.json()

				})
				.then((data) => {

					if (props.onFileUploadSuccess) {
						props.onFileUploadSuccess(data, callback, props.uri)

						return
					}

					callback(props.uri + data.id, { text: '' })

				})
				.catch((error) => notifyError(error.message))

		}

	}

	const config = computed(() => {

		// Las dos ramas compartian casi toda la configuracion; solo la de
		// archivos anade opciones.
		const base = {
			path_absolute: "/",
			selector: "textarea.editor",
			branding: false,
			plugins: props.plugins,
			toolbar: props.toolbar,
			menubar: props.menubar,
			browser_spellcheck: true,
			contextmenu: false,
			height: props.height,
			cleanup: true,
			relative_urls: false,
			paste_data_images: false,
			skin: isDarkMode.value ? 'oxide-dark' : 'oxide',
			content_css: isDarkMode.value ? 'dark' : 'default',
			setup,
		}

		if (! props.file) {
			return { ...base, ...props.extraConfig }
		}

		return {
			...base,
			default_link_target: "_blank",
			extended_valid_elements: "a[href|target=_blank]",
			target_list: false,
			autosave_interval: "20s",
			autosave_retention: "30m",
			image_advtab: true,
			file_picker_types: 'image file media',
			file_picker_callback: filePickerCallback,
			init_instance_callback: (editor) => {

				// Ctrl+S deja de guardar la pagina del navegador.
				editor.addShortcut("ctrl+s", "Custom Ctrl+S", "custom_ctrl_s")

				editor.addCommand("custom_ctrl_s", () => {
					alert('This option has been disabled')

					return false
				})

			},
			...props.extraConfig,
		}

	})

	const onTranscriptionEnd = (data) => {

		const sentence = data.lastSentence[0].toLowerCase() + data.lastSentence.slice(1) + ' '

		value.value = value.value + ' ' + sentence

	}

</script>