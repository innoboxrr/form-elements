<template>
	
	<div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

        	<label class=" ml-2 text-sm font-medium text-gray-900 dark:text-white">
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
            	:tinymce-script-src="tinymceCdn"
            	class="editor" 
            	v-model="value" />

            

        </div>

    </div>

</template>

<script>

    import Editor from '@tinymce/tinymce-vue';
    import SpeechRecognition from './components/SpeechRecognition.vue'
	
	export default {

		components: {
			Editor,
			SpeechRecognition,
		},

		props: {

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

			extraConfig: {
				type: Object,
				default: () => {}
			},

			onFileUploadSuccess:{
				type: Function,
				default: null
			}
			
		},

		emits: ['update:modelValue'],

		mounted(){
			console.log(this.uploadUrl);
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

			isDarkMode() {
				
				return document.body.classList.contains('dark');

			},

			config() {

				if(this.file) {

					return {
            
			            path_absolute : "/",
			            
			            selector: "textarea.editor",

			            branding: false,
			        
			            plugins: this.plugins,

			            toolbar: this.toolbar,

			            menubar: this.menubar,

			            browser_spellcheck: true,
  						
  						contextmenu: false,

			            height : this.height,

			            cleanup : true,

			            default_link_target: "_blank",
			            
			            extended_valid_elements : "a[href|target=_blank]",
			            
			            target_list: false,
			            
			            autosave_interval: "20s",
			            
			            autosave_retention: "30m",
			            
			            relative_urls: false,

			            paste_data_images: false,

			            skin: this.isDarkMode ? 'oxide-dark' : 'oxide',

			            content_css: this.isDarkMode ? 'dark' : 'default',
			            
			            image_advtab: true,

			            file_picker_types: 'image file media',

			            file_picker_callback: (callback, value, meta) => {

			                // Tipo de archivos
			                let filetype = meta.filetype;

			                // Crear un elemento input para capturar el archivo subido
			                var input = document.createElement('input');

			                // Definir atributos para el input
			                input.setAttribute('name', 'file');
			                input.setAttribute('type', 'file');
			                input.setAttribute('style', 'display:none;');

			                // Adjuntar el input al body
			                document.body.appendChild(input);

			                // Simular un clic para el input de archivo. 
			                // PENDIENTE: En un futuro esta sección deberá abrir el exlorador de archivos para el usuario.
			                input.click();

			                // Evento a lanzar cuendo el input tenga un nuevo archivo
			                input.onchange = () => {

								// Instanciar un nuevo objeto de tipo formData 
		                        var formData = new FormData();

		                        // Token de acceso
		                        formData.append('_token', csrf_token);

		                        // Adjuntar el archivo
                        		formData.append('file', input.files[0]);

                        		formData.append('visibility', 'public');

                        		/*
                        		axios.post(uploadUrl, formData).then(res => {

                        			callback(uri +  res.data.id, {text: ''});

                        		}).catch( error => {

                        			UIkit.notification({
                        				message: lang.key('An error has occurred'),
                        				status: 'danger'
                        			});

                        		});
                        		*/

								fetch(this.uploadUrl, {
								
									method: 'POST',
								
									body: formData
								
								}).then(response => {
								
									if (response.ok) {
									
										return response.json();
									
									} else {
									
										throw new Error('An error has occurred');
									
									}

								}).then(data => {
									if (this.onFileUploadSuccess) {
										// Llamar a la función prop con los datos necesarios
										this.onFileUploadSuccess(data, callback, this.uri);
									} else {
										// O manejar la respuesta por defecto si no se proporciona ninguna función
										callback(this.uri + data.id, {text: ''});
									}								
								}).catch(error => {
									
									UIkit.notification({
									
										message: error.message,
										
										status: 'danger'
									
									});

								});

			                
			                }

			            },

			            init_instance_callback: function (editor) {

			                // Modificar el comportamiento para Ctrl+S
			                editor.addShortcut("ctrl+s", "Custom Ctrl+S", "custom_ctrl_s");

			                editor.addCommand("custom_ctrl_s", function() {

			                    alert('This option has been disabled');

			                    return false;

			                });

			            },

						setup: function (editor) {
							editor.on('OpenWindow', function () {

								console.log('open');
								
								function tryFocus() {
									var firstElement = document.querySelector('.tox-form input, .tox-form textarea, .tox-form select');
									if (firstElement) {
										firstElement.focus();
										return true;
									}
									return false;
								}

								// Intenta enfocar inmediatamente y luego varias veces en intervalos
								if (!tryFocus()) {
									var attempts = 10;
									var interval = setInterval(function () {
										if (tryFocus() || --attempts <= 0) {
											clearInterval(interval);
										}
									}, 50);
								}
							});
						},

						...this.extraConfig,

			        };

				} else {

					return {

			            path_absolute : "/",
			            
			            selector: "textarea.editor",

			            branding: false,
			            
			            plugins: this.plugins,

			            toolbar: this.toolbar,

			            menubar: this.menubar,

			            browser_spellcheck: true,
  						
  						contextmenu: false,

			            height : this.height,

			            cleanup : true,
			            
			            relative_urls: false,

			            paste_data_images: false,

			            skin: this.isDarkMode ? 'oxide-dark' : 'oxide',

			            content_css: this.isDarkMode ? 'dark' : 'default',

						setup: function (editor) {
							editor.on('OpenWindow', function () {

								console.log('open');

								function tryFocus() {
									var firstElement = document.querySelector('.tox-form input, .tox-form textarea, .tox-form select');
									if (firstElement) {
										firstElement.focus();
										return true;
									}
									return false;
								}

								// Intenta enfocar inmediatamente y luego varias veces en intervalos
								if (!tryFocus()) {
									var attempts = 10;
									var interval = setInterval(function () {
										if (tryFocus() || --attempts <= 0) {
											clearInterval(interval);
										}
									}, 50);
								}
							});
						},

						...this.extraConfig,

			        };

				}

			}

		},

		methods: {

			onTranscriptionEnd(data) {

				let str = data.lastSentence[0].toLowerCase() + data.lastSentence.slice(1) + ' ';

				this.value += ' ' + str;

			}

		},

	}

</script>