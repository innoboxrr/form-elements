<template>
    
    <div v-if="showForm">
        
        <!-- model_id -->
        <select-search-input-component
            :custom-class="customClass"
            :input-label="labelStr"
            :placeholder="placeholderStr"
            :ajax="true"
            :filterable="false"
            :method="method"
            :route="route"
            :q="q"
            :search-params="searchParams"
            :reduce="reduce"
            :get-option-label="getOptionLabel"
            :min-search-length="0"
            :multiple="multiple"
            :noOptionsText="noOptionsText"
            v-model="model_id" />  

    </div>

</template>

<script>

    import SelectSearchInputComponent from './SelectSearchInputComponent.vue'
    
    export default {

        components: {

            SelectSearchInputComponent,

        },

        props: {

            customClass: {
                type: String,
                required: false,
            },

            hideOnEmit: {
                type: Boolean,
                default: false
            },

            labelStr: {
                type: String,
                required: true,
            },

            placeholderStr: {
                type: String,
                required: true,
            },

            route: {
                type: String,
                required: true,
            },

            method: {
                type: String,
                default: 'get',
            },

            q: {
                type: String,
                default: 'id'
            },

            externalFilters: {
                type: Object,
                default: {}
            },

            reduce: {
                type: Function,
                default: option => option.id
            },

            getOptionLabel: {
                type: Function,
                default: option => `ID: ${option.id}`
            },

            multiple: {
                type: Boolean,
                default: false
            },

            noOptionsText: {
                type: String,
                default: 'Nothing results found',
            },

        },

        emits: ['submit'],

        data() {

            return {

                model_id: [],

                searchParams: {},

                showForm: true,

            }

        },

        mounted() {

            this.searchParams = {

                ...this.externalFilters,

            }   

        },

        watch: {

            model_id(val) {

                if(Number.isInteger(val) && val > 0) {

                    this.$emit('submit', val);

                    this.showForm = !this.hideOnEmit;

                } else {

                    this.$emit('submit', val);
                    
                }

            }

        }

    }

</script>