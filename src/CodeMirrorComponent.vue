<template>

    <div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

            <label class="uk-form-label">{{ label }}</label>

            <codemirror
                :placeholder="placeholder"
                :style="{ height: '400px' }"
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="4"
                :extensions="extensions"
                @ready="handleReady" 
                v-model="value" />

        </div>

    </div>

</template>

<script>

    // Docs: https://www.npmjs.com/package/vue-codemirror
    
    import { Codemirror } from 'vue-codemirror'
    import { html } from '@codemirror/lang-html'
    import { css } from '@codemirror/lang-css'
    import { javascript } from '@codemirror/lang-javascript'
    import { json } from '@codemirror/lang-json'
    import { oneDark } from '@codemirror/theme-one-dark'

    export default {
    
        components: {
    
            Codemirror
    
        },

        props: {

            label: {
                type: String,
                required: false,
                default: ''
            },

            lang: {
                type: String,
                default: 'html'
            },

            placeholder: {
                type: String,
                default: 'Escriba su código aquí...'
            },

            modelValue: {
                type: String,
                default: ""
            }

        },

        emits: ['update:modelValue'],

        setup(props) {

            const getLang = () => {

                if(props.lang == 'html') return html();

                if(props.lang == 'css') return css();

                if(props.lang == 'javascript') return javascript();

                if(props.lang == 'json') return json();

            }

            const extensions = [

                getLang(),

                oneDark

            ];

            return {

                extensions

            }

        },

        data () {

            return {

                view: undefined,

                value: `console.log('Hello, world!')`,

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

            }

        },

        methods: {

            handleReady(payload) {

                this.view = payload.view;

            }

        }

    }

</script>