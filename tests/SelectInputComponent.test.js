import { describe, expect, it } from 'vitest'
import { defaultTheme } from 'innoboxrr-form-core'
import { mount } from '@vue/test-utils'

import SelectInputComponent from '../src/SelectInputComponent.vue'

const factory = (props = {}, options = {}) => mount(SelectInputComponent, {
    props: { name: 'estado', ...props },
    slots: {
        default: '<option value="a">A</option><option value="b">B</option>',
    },
    ...options,
})

describe('SelectInputComponent', () => {

    it('pinta la etiqueta y los atributos del select', () => {
        const wrapper = factory({ label: 'Estado', validators: 'required', size: 3 })

        expect(wrapper.find('label').text()).toContain('Estado')

        const select = wrapper.find('select')

        expect(select.attributes('name')).toBe('estado')
        expect(select.attributes('data-validators')).toBe('required')
        expect(select.attributes('size')).toBe('3')
    })

    it('renderiza las opciones que recibe por slot', () => {
        expect(factory().findAll('option')).toHaveLength(2)
    })

    it('aplica la clase por defecto y la personalizada', () => {
        expect(factory().find('select').classes()).toContain(defaultTheme.select)

        expect(factory({ customClass: 'mi-clase' }).find('select').classes()).toEqual(['mi-clase'])
    })

    it('refleja modelValue y emite update:modelValue', async () => {
        const wrapper = factory({ modelValue: 'a' })

        expect(wrapper.find('select').element.value).toBe('a')

        await wrapper.find('select').setValue('b')

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['b'])
    })

    it('soporta seleccion multiple', () => {
        expect(factory().find('select').attributes('multiple')).toBeUndefined()

        expect(factory({ multiple: true, modelValue: [] }).find('select').attributes('multiple')).toBeDefined()
    })

    it('muestra la ayuda como tooltip', () => {
        expect(factory().find('[data-tooltip]').exists()).toBe(false)

        const icono = factory({ help: 'Ayuda' }).find('[data-tooltip]')

        expect(icono.attributes('data-tooltip')).toBe('Ayuda')
        expect(icono.attributes('aria-label')).toBe('Ayuda')
    })

})
