<template>
    
    <div class="uk-margin">

        <lv-colorpicker 
            :label="label"
            :clearable="clearable"
            :bottom-bar="bottomBar"
            :colors="colors"
            v-model="value"  />

    </div>

</template>

<script>
    
    import LvColorpicker from 'lightvue/color-picker'; // Docs: https://vue3.lightvue.org/vue-components/color-picker
    
    export default {

        components: {
        
            LvColorpicker,
        
        },

        props: {

            label: {
                type: String,
                required: false,
                default: ''
            },

            clearable: {
                type: Boolean,
                default: true,
            },

            bottomBar: {
                type: Boolean,
                default: true,
            },

            colors: {
                type: Array,
                default: [
                    "#F44336",
                    "#E91E63",
                    "#9C27B0",
                    "#673AB7",
                    "#3F51B5",
                    "#2196F3",
                    "#03A9F4",
                    "#00BCD4",
                    "#009688",
                    "#4CAF50",
                    "#8BC34A",
                    "#CDDC39",
                    "#FFEB3B",
                    "#FFC107",
                    "#FF9800",
                    "#795548"
                ]
            },

            modelValue: {
                default: "#607C8A"
            }

        },

        emits: ['update:modelValue'],
    
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
    
    }

</script>

<style>
    
    .lv-input__label {
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
        font-size: 0.875rem;
    }

    .lv-overlaypanel {
        z-index: 1015 !important;
    }

</style>