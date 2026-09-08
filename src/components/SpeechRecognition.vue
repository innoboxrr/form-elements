<template>

    <div v-if="showInterface" class="container">

        <div v-if="isRecording">
            
            <div class="recording-container">

                <div class="recording-circle" @click="stopRecognition">

                    <IconComponent name="pause" custom-class="pause-icon" />

                </div>

                <div class="recording-text">

                    Grabando...

                </div>

            </div>

        </div>

        <div v-else>
            
            <div>
                
                <div class="microphone-container" @click="startRecognition">

                    <IconComponent name="record" />

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

    import { onMounted, ref, shallowRef } from 'vue'
    import IconComponent from '../IconComponent.vue'

    const props = defineProps({

        lang: {

            type: String,

            default: 'es-ES'

        }

    })

    const emit = defineEmits(['onTranscriptionEnd', 'onRuntimeTranscription'])

    const showInterface = ref(false)
    const runtimeTranscription = ref('')
    const transcription = ref([])
    const isRecording = ref(false)

    // Objeto del navegador: no debe hacerse reactivo en profundidad.
    const recognition = shallowRef(null)

    const startRecognition = () => {

        recognition.value?.start()

        isRecording.value = true

    }

    const stopRecognition = () => {

        isRecording.value = false

        recognition.value?.stop()

    }

    const checkApi = () => {

        const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition

        /**
         * Antes se comprobaba `if (!SpeechRecognition && "development" !== 'production')`
         * y lanzaba un Error. La cadena literal siempre es distinta de
         * 'production', asi que la condicion se reducia a que la API no
         * existiera: cualquier navegador sin reconocimiento de voz reventaba
         * en lugar de esconder el boton, que es lo que hacia el return de
         * abajo (inalcanzable).
         */
        if (! Recognition) {
            console.warn('[innoboxrr-form-elements] Speech Recognition no esta disponible en este navegador.')

            return
        }

        showInterface.value = true

        const instance = new Recognition()

        instance.lang = props.lang
        instance.interimResults = true

        instance.addEventListener('result', (event) => {

            runtimeTranscription.value = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('')

        })

        instance.addEventListener('end', () => {

            if (runtimeTranscription.value !== '') {

                transcription.value.push(runtimeTranscription.value)

                emit('onTranscriptionEnd', {
                    transcription: transcription.value,
                    lastSentence: runtimeTranscription.value,
                })

                if (isRecording.value) {
                    instance.start()
                }

            }

            runtimeTranscription.value = ''

        })

        instance.onresult = (event) => emit('onRuntimeTranscription', event.results[0])

        recognition.value = instance

    }

    onMounted(checkApi)

</script>

<style>

    .container {
        display: inline-block;
    }
    
    .recording-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0.25em;
        background-color: rgb(99, 99, 99);
        border-radius: 0.25em;
        width: 85px;
    }

    .recording-circle {
        position: relative;
        background-color: red;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        animation: ease pulse 2s infinite;
        margin-right: 0.25em;
    }

    .recording-text {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        font-size: 0.75em;
        color: white;
    }

    @keyframes pulse {
        0% {
            background-color: red;
        }
        50% {
            background-color: #f06c6c;
        }
        100% {
            background-color: red;
        }
    }

    .pause-icon {
        color: #fff;
        font-size: 8px;
        padding: 0;
        margin: 0;
        position: absolute;
        top: 3.5px;
        left: 3.75px;
        cursor: pointer;
    }

    .microphone-container {
        padding: 0px 7px;
        border: 1px solid #f0f2f5;
        margin: 4px;
        color: #666;
        border-radius: 5px;
    }

    .microphone-container:hover {
        cursor: pointer;
        background-color: #f0f2f5;
        transition: all .5s;
    }

</style>