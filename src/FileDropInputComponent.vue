<template>
    
    <div 
        @click="openFileDialog"
        @drop.prevent="handleDrop" 
        @dragover.prevent 
        class="mb-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:border-slate-400 dark:hover:bg-slate-500 pointer">
        
        <i class="fa-solid fa-photo-film text-slate-500 my-3 dark:text-slate-200"></i>
        
        <p class="text-slate-400 text-sm pt-2 dark:text-slate-200 pointer">
            {{ mainText }}
        </p>
        
        <p class="text-slate-400 text-xs pt-2 dark:text-slate-200 pointer">
            {{ subText }}
        </p>
        
        <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            @change="handleFileChange" 
            :multiple="multiple">

    </div>

</template>

<script>
    
    export default {

        props: {

            multiple: {
                type: Boolean,
                default: false,
            },

            mainText: {
                type: String,
                default: 'Arrastra y suelta el archivo aquí'
            },

            subText: {
                type: String,
                default: 'o haz clic para seleccionar los archivos.'
            },

        },

        emits: ['change'],

        methods: {

            openFileDialog() {
                
                this.$refs.fileInput.click();

            },

            handleDrop(event) {
                
                const files = Array.from(event.dataTransfer.files);

                this.$emit('change', files);

            },

            handleFileChange(event) {
                
                const files = Array.from(event.target.files);

                this.$emit('change', files);

            },

        }

    }

</script>