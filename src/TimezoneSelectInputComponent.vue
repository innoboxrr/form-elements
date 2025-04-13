<template>
    <SelectSearchInputComponent
        class="timezone"
        :validators="validators"
        :name="name"
        :input-label="label"
        :help="help"
        :multiple="multiple"
        :size="size"
        v-model="value"
        :options="timezoneOptions"
        :placeholder="placeholder"
    />
</template>

<script>
    import SelectSearchInputComponent from './SelectSearchInputComponent.vue'
    import timezoneOptions from './js/timezone.js'

    export default {
        components: {
            SelectSearchInputComponent,
        },
        props: {
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: 'Select a timezone'
            },
            help: {
                type: String,
                default: null
            },
            name: {
                type: String,
                required: true
            },
            multiple: {
                type: Boolean,
                default: false
            },
            size: {
                type: Number,
                default: null
            },
            validators: {
                type: String,
                default: ''
            },
            modelValue: {
                type: [String, Number, Array, Object],
                default: ""
            }
        },
        data() {
            return {
                timezoneOptions
            }
        },
        emits: ['update:modelValue'],
        computed: {
            value: {
                get() {
                    return this.modelValue
                },
                set(value) {
                    this.$emit('update:modelValue', value.value)
                }
            }
        }
    }
</script>

<style>
    .vs__dropdown-toggle {
        border: 0 !important;
    }
</style>