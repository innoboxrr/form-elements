<template>
    <div class="uk-margin">
        <div class="uk-inline uk-width-1-1">
            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                <span v-if="help" class="cursor-pointer">
                    <i :uk-tooltip="`title: ${help}`" class="fa-solid fa-circle-question"></i>
                </span>
                {{ label }}
            </label> 

            <input 
                :class="customClass"
                type="text" 
                ref="tagsInput"
                :placeholder="placeholder" />
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
            default: ''
        },
        help: {
            type: String,
            default: null
        },
        customClass: {
            type: String,
            default: 'uk-input uk-form-large uk-border-rounded'
        },
        name: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: ''
        },
        modelValue: {
            type: [String, Array],
            default: () => []
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            tagify: null
        }
    },
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    },
    mounted() {
        this.initTagify();
    },
    beforeUnmount() {
        if (this.tagify) {
            this.tagify.destroy();
            this.tagify = null;
        }
    },
    watch: {
        modelValue: {
            handler(newVal) {
                const tags = Array.isArray(newVal) ? newVal : [];
                if (this.tagify) {
                    const current = this.tagify.value.map(t => t.value);
                    if (JSON.stringify(current) !== JSON.stringify(tags)) {
                        this.tagify.loadOriginalValues(tags);
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        initTagify() {
            const tagsInput = this.$refs.tagsInput;
            this.tagify = new Tagify(tagsInput);
            this.tagify.on('add', this.onTagChange);
            this.tagify.on('remove', this.onTagChange);
        },
        onTagChange() {
            this.value = this.tagify.value.map(tag => tag.value);
        }
    }
}
</script>
