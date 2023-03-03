<template>

    <div>
    
        <single-checkbox-input-component
            v-for="option in options"
            :key="option"
            :id="id"
            :label="option.name" 
            :value="option.name" 
            :checked="value.includes(option.id)"
            @update:checked="check(option.id, $event)" />

    </div>

</template>

<script>

    import SingleCheckboxInputComponent from './SingleCheckboxInputComponent.vue'

    export default {

        components: {
        
            SingleCheckboxInputComponent,
        
        },
            
        props: {

            id: {
                type: String,
            },
        
            value: {
            
                type: Array,
                
                required: true,
            
            },
            
            options: {
            
                type: Array,
                
                required: true,
                
                validator: (value) => {
                
                    const hasNameKey = value.every((option) =>
                    
                        Object.keys(option).includes("name")
                    
                    );
                    
                    const hasIdKey = value.every((option) =>
                    
                        Object.keys(option).includes("id")
                    
                    );
                    
                    return hasNameKey && hasIdKey;
                
                },
            
            },
        
        },

        emits: ["update:value"],
        
        methods: {

            check(optionId, checked) {

                let options = document.querySelectorAll(`[name=input_${this.id}]`);

                let values = [];

                options.forEach( option => {

                    if(option.checked) {

                        values.push(option.value);

                    }

                });

                this.$emit('update:value', values);
            
            }

        }
    
    }

</script>
