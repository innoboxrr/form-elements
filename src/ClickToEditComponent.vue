<template>
    
    <div>

        <input 
            class="uk-input uk-form-large uk-border-rounded" 
            type="text"
            v-if="edit"
            :value="valueLocal"
            @keyup.esc.native="valueLocal = value; edit = false;"
            @keyup.enter.native="valueLocal = $event.target.value; edit = false; $emit('input', valueLocal);"
            v-focus="" />

            <p v-else="" @click="edit = true;">

                {{valueLocal}}
        
            </p>

    </div>

</template>

<script>
    export default {

        props: ['value'],

        emits: ['input'],

        data () {

            return {

                edit: false,

                valueLocal: this.value

            }

        },

        watch: {

            value: function() {

                this.valueLocal = this.value;

            }

        },

        directives: {

            focus: {

                inserted (el) {

                    el.focus()

                }

            }
        }

    }
</script>