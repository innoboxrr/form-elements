<!--
    TODO:
        Temporalmente está deshabilitad la línea this.uploadFiles(); en el watch de fileList()
        Implementar un botón algo agnostico para cuando autoUpload sea false
-->

<template>
    
    <div class="pointer drop-input">

        <div v-if="showTopPreview"> 

            <div class="uk-flex uk-flex-center preview" uk-grid>
                
                <div :class="previewGridClass" v-for="file in fileList" :key="file.name">

                    <div class="uk-position-relative uk-text-center">
                        
                        <div class="uk-inline-clip uk-transition-toggle uk-light" tabindex="0">

                            <img class="preview-img" :data-src="file.preview" width="180" height="180" uk-img>

                            <div class="uk-position-center">

                                <i 
                                    class="fas fa-trash-alt fa-2x uk-transition-fade" 
                                    @click="deleteFile(file)"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
        
        <label v-if="!currentOnUpload && !maxFilesReached"> 

            <div 
                :class="`${dropzoneClass} ${onDropClass}`"
                @dragover.prevent="handleDragOver"
                @drop.prevent="handleDrop"
                @dragleave.prevent="handleDragLeave">    

                    <template v-if="!onDrop">{{ message }}</template>

                    <template v-else>{{ onDropMessage }}</template>

                    <slot v-if="!onDrop" name="normalSlot"></slot>

                    <slot v-else name="onDropSlot"></slot>
                    
                    <input 
                        class="file-input" 
                        type="file" 
                        :name="name" 
                        :multiple="multiple" 
                        @change="handleFileChange($event)" />

            </div>

        </label>

        <div v-else-if="currentOnUpload" :class="`${dropzoneClass} ${onDropClass} dropzone-disable dark:text-white`">

            {{ onUploadMessage }}

            <slot name="onUploadSlot"></slot>

        </div>

        <div v-else-if="maxFilesReached">
            
            <div v-if="!hideOnMaxFilesReached" :class="`${dropzoneClass} ${onDropClass} dropzone-disable`">
                
                Máximo número de archivos alcanzados

            </div>

        </div>

        <div v-if="showBottomPreview"> 

            <div class="uk-flex uk-flex-center preview" uk-grid>
                
                <div :class="previewGridClass" v-for="file in fileList" :key="file.name">

                    <div class="uk-position-relative uk-text-center">
                        
                        <div class="uk-inline-clip uk-transition-toggle uk-light" tabindex="0">

                            <img class="preview-img" :data-src="file.preview" width="180" height="180" uk-img>

                            <div class="uk-position-center">

                                <i 
                                    class="fas fa-trash-alt fa-2x uk-transition-fade" 
                                    @click="deleteFile(file)"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <div v-if="errors.length > 0">
            
            <p>{{ 'Validation errors' }}: </p>

            <ul>
                
                <li 
                    v-for="error in errors"
                    :key="error.name"
                    class="error-msg">File: {{ error.name }} {{ 'has has the following errors: ' }}
                    <ul>
                        <li v-for="err in error.errors">
                            {{ err }}
                        </li>
                    </ul>
                </li>

            </ul>

        </div>

    </div>

</template>

<script>

    import { validateFiles } from './js/files.js'
    
    export default {    

        props: {
            uploadUrl: {
                type: String,
                required: true,
            },
            method: {   
                type: String,
                method: 'POST'
            },
            autoUpload: {
                type: Boolean,
                default: false
            },
            name: {
                type: String,
                default: 'file'
            },
            visibility: {
                type: String,
                default: 'public'
            },
            // bytes, zero for unlimited
            maxSize: {
                type: Number,
                default: 0 
            },  
            // bytes, zero for unlimited (In case of multiple file, the sum for all)
            totalMaxSize: {
                type: Number,
                default: 0
            },
            // If multiple is true, the total files the user can submit
            maxFiles: {
                type: Number,
                default: 1
            },
            validMimes: {
                type: Array,
                default: [

                    'text/plain',
                    
                    'image/gif',
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    
                    'audio/mp3',
                    'audio/mpeg',
                    'audio/midi',
                    
                    'video/mp4',
                    'video/quicktime',
                    
                    'application/pdf',

                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',

                    'application/gzip',

                ]
            },
            dropzoneClass: {
                type: String,
                default: 'drop-zone'
            },
            message: {
                type: String,
                default: 'Drop files here or click here to upload their files'
            },
            onDropMessage: {
                type: String,
                default: 'Drop files here...'
            },
            onUploadMessage: {
                type: String,
                default: 'Files are being uploaded'
            },
            hideOnMaxFilesReached: {
                type: Boolean,
                default: false
            },
            previewGridClass: {
                type: String,
                default: 'uk-width-1-4@m'
            },
            showTopPreview: {
                type: Boolean,
                default: false
            },
            showBottomPreview: {
                type: Boolean,
                default: false
            }
        },

        emits: ['startUpload', 'updateFileList', 'endUpload'],

        data() {
            
            return {

                files: [],
                
                paths: [], // Arreglo de las URI de los archivos subidos
                
                onDrop: false,
                
                currentOnUpload: false,
                
                rules: {
                    maxSize: this.maxSize,
                    validMimes: this.validMimes
                },
                
                errors: [], // Archivos con errores, se adjuntan desde pushFiles

            }

        },

        watch: {

            fileList(val) {

                if(val.length > 0 && !this.currentOnUpload){

                    if(this.autoUpload) {

                        this.currentOnUpload = true;

                        this.uploadFiles();

                    }else {

                        console.log('Mostrar botón para subir los archivos');

                    }

                }

                setTimeout( () => { this.errors = []}, 5000);

            }

        },

        computed: {

            multiple() {

                return (this.maxFiles > 1) ? true : null;

            },

            maxFilesReached() {

                return (this.fileList.length >= this.maxFiles);

            },

            onDropClass() {

                return (this.onDrop) ? 'ondrop' : '';

            },

            fileList() {

                let fileList = [];

                for (var i = 0; i < this.files.length; i++) {

                    for (var j = 0; j < this.files[i].length; j++) {

                        fileList.push(this.files[i][j]);

                    }

                }

                return fileList;

            }

        },

        methods: {

            handleFileChange(e) {

                let files = [...e.target.files];

                // Publicar imágenes
                this.pushFiles(files);

            },

            handleDragOver(){

                this.onDrop = true;

            },

            handleDrop(){

                this.onDrop = false;

                let files = [];

                // Recorrer cada uno de los elementos enviados
                for (var i = 0; i < event.dataTransfer.items.length; i++) {

                    // Capturar cada uno como archivo y sumarlo al arreglo local "files"
                    files.push(event.dataTransfer.items[i].getAsFile());

                }

                // Publicar imágenes
                this.pushFiles(files);

            },

            handleDragLeave(){

                this.onDrop = false;

            },

            pushFiles(files) {

                if(!this.currentOnUpload) {

                    validateFiles(files, this.rules).then( files => {

                        let validFiles = files.filter( file => file.validation == true);

                        let invalidFiles = files.filter( file => file.validation == false);

                        this.files.push(validFiles);

                        this.errors.push(...invalidFiles);
                        
                    }).catch(error => {

                        console.log(error);

                    });

                }

            },

            uploadFiles() {

                this.fileList.forEach( file => {

                    if(!file.uploaded && file.validation) {

                        this.$emit('startUpload', true);

                        this.currentOnUpload = true;

                        let formData = new FormData();

                        formData.append('_token', csrf_token);
                        
                        formData.append('file', file);

                        formData.append('visibility', this.visibility);

                        /*
                        axios.post(this.uploadUrl, formData).then( res => {

                            file.uploaded = true;

                            file.path = res.data.path;

                            file.id = res.data.id;

                            this.currentOnUpload = false;

                            this.$emit('updateFileList', this.fileList);

                            this.$emit('endUpload', true);

                        }).catch( error => {

                            console.log(error.response);

                        });
                        */
                        fetch(this.uploadUrl, {
                          method: 'POST',
                          body: formData
                        })
                        .then(response => {
                          if (response.ok) {
                            return response.json();
                          } else {
                            throw new Error('An error has occurred');
                          }
                        })
                        .then(data => {
                          file.uploaded = true;
                          file.path = data.path;
                          file.id = data.id;
                          this.currentOnUpload = false;
                          this.$emit('updateFileList', this.fileList);
                          this.$emit('endUpload', true);
                        })
                        .catch(error => {
                          console.log(error);
                        });


                    } else {

                        this.$emit('updateFileList', this.fileList);

                        this.currentOnUpload = false;

                    }

                });

            },

            deleteFile(file) {

                // PENDIENTE: Elimianr el archivo desde el servidor

                this.files.pop(file);

                this.$emit('updateFileList', this.fileList);

            }   

        }

    }

</script>

<style scoped>

    .pointer {
        cursor: pointer;
    }
    
    .file-input {
        display: none;
    }

    .dropzone-disable {
        cursor: no-drop;
    }

    .fa-trash-alt {
        color: #ff5454;
    }

    .drop-input {
        border: dotted lightskyblue;
        padding: 20px;
        background: #87ceeb30;
    }

    .drop-zone {
        padding: 20px;
        background: #87ceeb30;
        text-align: center;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .drop-zone.ondrop {
        background: #87ceeb66;
    }

</style>