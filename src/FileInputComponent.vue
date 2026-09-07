<!--
    TODO:
        Temporalmente está deshabilitad la línea this.uploadFiles(); en el watch de fileList()
        Implementar un botón algo agnostico para cuando autoUpload sea false
-->

<template>
    
    <div class="pointer drop-input">

        <div v-if="showTopPreview"> 

            <div class="fe-flex fe-justify-center preview" fe-grid>
                
                <div :class="previewGridClass" v-for="file in fileList" :key="file.name">

                    <div class="fe-relative fe-text-center">
                        
                        <div class="fe-inline-clip fe-reveal" tabindex="0">

                            <img class="preview-img" :data-src="file.preview" width="180" height="180" >

                            <div class="fe-center-abs">

                                <i 
                                    class="fas fa-trash-alt fa-2x fe-reveal-target" 
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

                    <p v-if="!onDrop" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ message }}</p>

                    <p v-else class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ onDropMessage }}</p>

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
            
            <div v-if="!hideOnMaxFilesReached" :class="`${dropzoneClass} ${onDropClass} dropzone-disable ml-2 text-sm font-medium text-gray-900 dark:text-white`">
                
                Máximo número de archivos alcanzados

            </div>

        </div>

        <div v-if="showBottomPreview"> 

            <div class="fe-flex fe-justify-center preview" fe-grid>
                
                <div :class="previewGridClass" v-for="file in fileList" :key="file.name">

                    <div class="fe-relative fe-text-center">
                        
                        <div class="fe-inline-clip fe-reveal" tabindex="0">

                            <img class="preview-img" :data-src="file.preview" width="180" height="180" >

                            <div class="fe-center-abs">

                                <i 
                                    class="fas fa-trash-alt fa-2x fe-reveal-target" 
                                    @click="deleteFile(file)"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <div v-if="errors.length > 0">
            
            <p class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ 'Validation errors' }}: </p>

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

<script setup>

    import { computed, ref, watch } from 'vue'
    import { describeFiles } from 'innoboxrr-form-core'

    const props = defineProps({
        uploadUrl: {
            type: String,
            required: true,
        },
        /**
         * Estaba declarado como `{ type: String, method: 'POST' }`: la clave
         * es `default`, no `method`, asi que el prop nunca tenia valor. Y
         * tampoco se usaba, porque fetch llevaba 'POST' fijo.
         */
        method: {
            type: String,
            default: 'POST'
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
        // Vue 3 exige factoria en los defaults de array.
        validMimes: {
            type: Array,
            default: () => ([

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

            ])
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
            default: 'fe-w-quarter'
        },
        showTopPreview: {
            type: Boolean,
            default: false
        },
        showBottomPreview: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['startUpload', 'updateFileList', 'endUpload'])

    // files es un array de lotes; fileList lo aplana.
    const files = ref([])
    const onDrop = ref(false)
    const currentOnUpload = ref(false)
    const errors = ref([])

    const rules = computed(() => ({
        maxSize: props.maxSize,
        validMimes: props.validMimes,
    }))

    const fileList = computed(() => files.value.flat())

    const multiple = computed(() => props.maxFiles > 1 ? true : null)

    const maxFilesReached = computed(() => fileList.value.length >= props.maxFiles)

    const onDropClass = computed(() => onDrop.value ? 'ondrop' : '')

    const csrfToken = () => globalThis.csrf_token
        ?? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        ?? ''

    const pushFiles = (incoming) => {

        if (currentOnUpload.value) {
            return
        }

        validateFiles(incoming, rules.value).then((validated) => {

            files.value.push(validated.filter((file) => file.validation === true))

            errors.value.push(...validated.filter((file) => file.validation === false))

        }).catch((error) => console.log(error))

    }

    const handleFileChange = (event) => pushFiles([...event.target.files])

    const handleDragOver = () => {
        onDrop.value = true
    }

    const handleDragLeave = () => {
        onDrop.value = false
    }

    /**
     * Recibia el evento por la global implicita `window.event` en lugar de
     * por parametro, que solo funciona en algunos navegadores y esta obsoleto.
     */
    const handleDrop = (event) => {

        onDrop.value = false

        pushFiles(Array.from(event.dataTransfer.items).map((item) => item.getAsFile()))

    }

    const uploadFiles = () => {

        fileList.value.forEach((file) => {

            if (file.uploaded || ! file.validation) {

                emit('updateFileList', fileList.value)
                currentOnUpload.value = false

                return

            }

            emit('startUpload', true)

            currentOnUpload.value = true

            const formData = new FormData()

            formData.append('_token', csrfToken())
            formData.append('file', file)
            formData.append('visibility', props.visibility)

            fetch(props.uploadUrl, { method: props.method, body: formData })
                .then((response) => {

                    if (! response.ok) {
                        throw new Error('An error has occurred')
                    }

                    return response.json()

                })
                .then((data) => {

                    file.uploaded = true
                    file.path = data.path
                    file.id = data.id
                    file.response = data

                    currentOnUpload.value = false

                    emit('updateFileList', fileList.value)
                    emit('endUpload', true)

                })
                .catch((error) => console.log(error))

        })

    }

    /**
     * Hacia `files.pop(file)`: pop() ignora sus argumentos y quita el ultimo
     * lote, asi que borrar un archivo eliminaba otro.
     */
    const deleteFile = (target) => {

        files.value = files.value
            .map((batch) => batch.filter((file) => file !== target))
            .filter((batch) => batch.length > 0)

        emit('updateFileList', fileList.value)

    }

    watch(fileList, (value) => {

        if (value.length > 0 && ! currentOnUpload.value && props.autoUpload) {
            currentOnUpload.value = true

            uploadFiles()
        }

        setTimeout(() => { errors.value = [] }, 5000)

    })

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