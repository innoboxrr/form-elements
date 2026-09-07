import { describe, expect, it } from 'vitest'
import { defaultTheme } from 'innoboxrr-form-core'
import { mount } from '@vue/test-utils'

import TextareaInputComponent from '../src/TextareaInputComponent.vue'

const factory = (props = {}) => mount(TextareaInputComponent, {
    props: { name: 'descripcion', ...props },
})

describe('TextareaInputComponent', () => {

    it('pinta la etiqueta y los atributos del textarea', () => {
        const wrapper = factory({
            label: 'Descripcion',
            placeholder: 'Escribe algo',
            validators: 'required length',
            min_length: '3',
            max_length: '1500',
        })

        expect(wrapper.find('label').text()).toBe('Descripcion')

        const textarea = wrapper.find('textarea')

        expect(textarea.attributes('name')).toBe('descripcion')
        expect(textarea.attributes('placeholder')).toBe('Escribe algo')
        expect(textarea.attributes('data-validators')).toBe('required length')
        expect(textarea.attributes('data-min_length')).toBe('3')
        expect(textarea.attributes('data-max_length')).toBe('1500')
    })

    it('usa cinco filas por defecto', () => {
        expect(factory().find('textarea').attributes('rows')).toBe('5')

        expect(factory({ rows: 12 }).find('textarea').attributes('rows')).toBe('12')
    })

    /**
     * Aqui la clase base va en el atributo `class` del template y la
     * personalizada se suma, no la sustituye: es distinto de los demas
     * componentes y conviene dejarlo fijado.
     */
    /**
     * El paquete era inconsistente: unos controles reemplazaban customClass y
     * otros la sumaban a una clase incrustada. Ahora la base sale del tema y
     * customClass la reemplaza, igual en todos.
     */
    it('la clase base sale del tema', () => {
        expect(factory().find('textarea').classes()).toContain(defaultTheme.textarea)
    })

    it('la clase personalizada reemplaza a la del tema', () => {
        const classes = factory({ customClass: 'mi-clase' }).find('textarea').classes()

        expect(classes).toContain('mi-clase')
        expect(classes).not.toContain(defaultTheme.textarea)
    })

    it('refleja modelValue y emite update:modelValue', async () => {
        const wrapper = factory({ modelValue: 'hola' })

        expect(wrapper.find('textarea').element.value).toBe('hola')

        await wrapper.find('textarea').setValue('adios')

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['adios'])
    })

})
