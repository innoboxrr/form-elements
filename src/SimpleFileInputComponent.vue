<template>
    
    <label class="file-select">
    
        <div class="select-button">
        
            <span v-if="hasFile">Archivo seleccionado: {{file.name}}</span>
            
            <span v-else>{{ label }}</span>
        
        </div>
        
        <input 
            :class="customClass"
            type="file" 
            :name="inputName" 
            @change="handleFileChange" />
    
    </label>

</template>

<script>

    export default {

        props: {

            customClass: {
                type: String,
                required: false,
            },

            inputName: {
                type: String,
                default: 'file'
            },

            label: {
                type: String,
                default: 'Seleccionar archivo'
            }

        },

        emits: ['input'],

        data() {

            return {
                file: {},
            }

        },

        computed: {

            hasFile() {

                return (this.file.size > 0);

            }

        },

        methods: {

            handleFileChange(e) {

                this.file = e.target.files[0];

                this.$emit('input', e.target.files[0])

            }

        }

    }

</script>

<style scoped>

    .file-select > .select-button {
        padding: 10px;
        color: white;
        background-color: #2EA169;
        border-radius: 10px;
        text-align: center;
        font-weight: bold;
    }

    .file-select > input[type="file"] {
        display: none;
    }

</style>