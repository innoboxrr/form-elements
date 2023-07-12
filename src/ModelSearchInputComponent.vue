<template>
    
    <div v-if="showForm">
        
        <!-- model_id -->
        <select-search-input-component
            :input-label="labelStr"
            :placeholder="placeholderStr"
            :ajax="true"
            :filterable="false"
            :route-name="routeName"
            :q="q"
            :search-params="searchParams"
            :reduce="reduce"
            :get-option-label="getOptionLabel"
            :min-search-length="0"
            v-model="model_id" />  

    </div>

</template>

<script>

    import SelectSearchInputComponent from './SelectSearchInputComponent'
    
    export default {

        components: {

            SelectSearchInputComponent,

        },

        props: {

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

            routeName: {
                type: String,
                required: true,
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
            }

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

                }

            }

        }

    }

</script>