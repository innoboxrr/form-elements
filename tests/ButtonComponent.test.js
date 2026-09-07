import { describe, expect, it } from 'vitest'
import { defaultTheme } from 'innoboxrr-form-core'
import { mount } from '@vue/test-utils'

import ButtonComponent from '../src/ButtonComponent.vue'

const factory = (props = {}) => mount(ButtonComponent, {
    props: { value: 'Enviar', ...props },
})

describe('ButtonComponent', () => {

    it('pinta el valor como texto del boton', () => {
        expect(factory({ value: 'Crear' }).find('button').text()).toBe('Crear')
    })

    it('es submit por defecto', () => {
        expect(factory().find('button').attributes('type')).toBe('submit')

        expect(factory({ type: 'button' }).find('button').attributes('type')).toBe('button')
    })

    it('aplica la clase por defecto y la personalizada', () => {
        expect(factory().find('button').classes()).toContain(defaultTheme.button)

        expect(factory({ customClass: 'mi-clase' }).find('button').classes()).toEqual(['mi-clase'])
    })

    it('se deshabilita cuando se le pide', () => {
        expect(factory().find('button').attributes('disabled')).toBeUndefined()

        expect(factory({ disabled: true }).find('button').attributes('disabled')).toBeDefined()
    })

})
