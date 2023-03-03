<template>

    <div v-if="showInterface" class="container">

        <div v-if="isRecording">
            
            <div class="recording-container">

                <div class="recording-circle" @click="stopRecognition">

                    <i class="fas fa-pause pause-icon"></i>

                </div>

                <div class="recording-text">

                    Grabando...

                </div>

            </div>

        </div>

        <div v-else>
            
            <div>
                
                <div class="microphone-container" @click="startRecognition">

                    <i class="fas fa-microphone"></i>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    export default {

        props: {

            lang: {

                type: String,

                default: 'es-ES'

            }

        },

        emits: ['onTranscriptionEnd', 'onRuntimeTranscription'],

        data() {

            return {

                showInterface: false,

                runtimeTranscription: '',

                transcription: [],

                recognition: null,

                isRecording: false,

            }

        },

        mounted() {

            this.checkApi();

        },

        methods: {

            startRecognition() {

                //this.checkApi();

                this.recognition.start();

                this.isRecording = true;

            },

            stopRecognition() {

                this.isRecording = false;

                this.recognition.stop();

                // this.recognition = null;

            },

            checkApi() {

                window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

                if (!SpeechRecognition && "development" !== 'production') {

                    throw new Error('Speech Recognition does not exist on this browser. Use Chrome or Firefox');

                }

                if (!SpeechRecognition) {

                    console.log("No Speech Recognition");

                    return;

                }

                this.showInterface = true;

                this.recognition = new SpeechRecognition();

                this.recognition.lang = this.lang;

                this.recognition.interimResults = true;

                // this.recognition.continuous = true;

                this.recognition.addEventListener('result', event => {

                    const text = Array.from(event.results)
                        .map(result => result[0])
                        .map(result => result.transcript)
                        .join('');

                    this.runtimeTranscription = text;

                });

                
                this.recognition.addEventListener('end', () => {

                    if (this.runtimeTranscription !== '') {

                        this.transcription.push(this.runtimeTranscription);

                        this.$emit('onTranscriptionEnd', {

                            transcription: this.transcription,

                            lastSentence: this.runtimeTranscription

                        });

                        if(this.isRecording) this.startRecognition();

                    }

                    this.runtimeTranscription = '';

                });

                this.recognition.onresult = (event) => {

                    var color = event.results[0][0].transcript;

                    this.$emit('onRuntimeTranscription', event.results[0]);

                }
                

            }

        },

    }

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