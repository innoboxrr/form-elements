import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import CheckboxInputComponent from '../src/CheckboxInputComponent.vue'
import RadioInputComponent from '../src/RadioInputComponent.vue'

describe('CheckboxInputComponent', () => {

    const factory = (props = {}) => mount(CheckboxInputComponent, {
        props: { name: 'acepta', ...props },
    })

    it('pinta el texto y los atributos', () => {
        const wrapper = factory({ text: 'Acepto', validators: 'required', val: 'si' })

        expect(wrapper.text()).toContain('Acepto')

        const input = wrapper.find('input')

        expect(input.attributes('type')).toBe('checkbox')
        expect(input.attributes('name')).toBe('acepta')
        expect(input.attributes('data-validators')).toBe('required')
        expect(input.attributes('value')).toBe('si')
    })

    it('refleja modelValue en el estado del control', () => {
        expect(factory({ modelValue: true }).find('input').element.checked).toBe(true)
        expect(factory({ modelValue: false }).find('input').element.checked).toBe(false)
    })

    it('emite update:modelValue al marcarlo', async () => {
        const wrapper = factory({ modelValue: false })

        await wrapper.find('input').setValue(true)

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([true])
    })

    it('renderiza el contenido del slot', () => {
        const wrapper = mount(CheckboxInputComponent, {
            props: { name: 'x' },
            slots: { default: '<span class="extra">mas</span>' },
        })

        expect(wrapper.find('.extra').exists()).toBe(true)
    })

})

describe('RadioInputComponent', () => {

    const factory = (props = {}) => mount(RadioInputComponent, {
        props: { name: 'opcion', val: 'a', ...props },
    })

    it('pinta el texto y los atributos', () => {
        const wrapper = factory({ text: 'Opcion A', validators: 'required' })

        expect(wrapper.text()).toContain('Opcion A')

        const input = wrapper.find('input')

        expect(input.attributes('type')).toBe('radio')
        expect(input.attributes('name')).toBe('opcion')
        expect(input.attributes('value')).toBe('a')
    })

    it('queda seleccionado cuando modelValue coincide con su valor', () => {
        expect(factory({ modelValue: 'a' }).find('input').element.checked).toBe(true)
        expect(factory({ modelValue: 'b' }).find('input').element.checked).toBe(false)
    })

    it('emite su valor al seleccionarlo', async () => {
        const wrapper = factory({ modelValue: 'b' })

        await wrapper.find('input').setValue()

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['a'])
    })

})
