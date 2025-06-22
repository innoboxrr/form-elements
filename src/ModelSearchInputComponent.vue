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
            :debounce-time="debounceTime"
            @search="setOptions"
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

            debounceTime: {
                type: Number,
                default: 300 // valor por defecto en milisegundos
            }

        },

        emits: ['submit', 'select'],

        data() {
            return {
                options: [],
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

                this.$emit('submit', val);

                if (Number.isInteger(val) && val > 0) {
                    this.showForm = !this.hideOnEmit;
                }

                if (!this.multiple && val != null) {
                    const selected = this.options?.find(
                        option => option.id === val
                    );
                    if (selected) {
                        this.$emit('selected', selected);
                    }
                }
            }
        },

        methods: {
            setOptions(options) {
                this.options = options;
            },
        },
    }
</script>