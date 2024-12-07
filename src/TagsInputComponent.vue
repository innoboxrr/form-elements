<template>
    <div class="uk-margin">
        <div class="uk-inline uk-width-1-1">

            <label class=" ml-2 text-sm font-medium text-gray-900 dark:text-white">
                <span v-if="help" class="cursor-pointer">
                    <i :uk-tooltip="`title: ${help}`" class="fa-solid fa-circle-question"></i>
                </span>
                {{ label }}
            </label> 

            <input 
                :class="customClass"
                type="text" 
                ref="tagsInput"
                :placeholder="placeholder"
                v-model="value" />

        </div>
    </div>
</template>
<script>
    import Tagify from '@yaireo/tagify';
    import './css/tagify.css';

    export default {
        props: {
            label: {
				type: String,
				required: false,
				default: ''
			},
			help: {
				type: String,
				required: false,
				default: null
			},
			customClass: {
				type: String,
				required: false,
				default: 'uk-input uk-form-large uk-border-rounded'
			},
            name: {
				type: String,
				required: true
			},
			placeholder: {
				type: String,
				required: false
			},
            modelValue: {
                type: [String, Array],
                required: false,
            },
        },
        emits: ['update:modelValue'],
        data() {
            return {
                tagify: null
            }
        },
        mounted() {
            this.initTagify();
        },
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
        methods: {
            initTagify() {
                let tagsInput = this.$refs.tagsInput;
                this.tagify = new Tagify(tagsInput);
                this.tagify.on('add', this.onTagChange);
                this.tagify.on('remove', this.onTagChange);
            },
            onTagChange(e) {
                this.value = this.tagify.value.map(tag => tag.value);
            }
        }
    }
</script>
