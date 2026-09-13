import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import DynamicGroupInputComponent from '../src/DynamicGroupInputComponent.vue'
import TextInputComponent from '../src/TextInputComponent.vue'

/**
 * Los textos que el componente muestra o lee el lector de pantalla los decide
 * la aplicación. Antes unos estaban escritos en la plantilla y otros llamaban
 * a una global `__()` que el paquete no declara.
 */
describe('textos de los componentes', () => {

    it('los grupos dinamicos se pintan sin una global __', () => {
        expect(globalThis.__).toBeUndefined()

        const wrapper = mount(DynamicGroupInputComponent, {
            props: {
                modelValue: [{ titulo: '' }],
                inputsConfig: [{ key: 'titulo', type: 'text', attributes: { label: 'Título' } }],
            },
        })

        expect(wrapper.find('h4').text()).toBe('Item #1')
        expect(wrapper.find('button[aria-label="Duplicar Item 1"]').exists()).toBe(true)
        expect(wrapper.find('button[aria-label="Eliminar 1"]').exists()).toBe(true)
        expect(wrapper.findAll('button').at(-1).text()).toBe('Añadir')
    })

    it('los grupos dinamicos usan los textos que se les pasan', () => {
        const wrapper = mount(DynamicGroupInputComponent, {
            props: {
                modelValue: [{ titulo: '' }],
                inputsConfig: [{ key: 'titulo', type: 'text', attributes: { label: 'Title' } }],
                itemLabel: 'Address',
                addButtonLabel: 'Add address',
                removeButtonLabel: 'Remove address',
            },
        })

        expect(wrapper.find('h4').text()).toBe('Address #1')
        expect(wrapper.find('button[aria-label="Remove address 1"]').exists()).toBe(true)
        expect(wrapper.findAll('button').at(-1).text()).toBe('Add address')
    })

    it('el boton de la contrasena dice lo que se le pasa', async () => {
        const wrapper = mount(TextInputComponent, {
            props: { type: 'password', name: 'secret', showPasswordLabel: 'Mostrar', hidePasswordLabel: 'Ocultar' },
        })

        const toggle = wrapper.find('.fe-password-toggle')

        expect(toggle.attributes('aria-label')).toBe('Mostrar')

        await toggle.trigger('click')

        expect(toggle.attributes('aria-label')).toBe('Ocultar')
    })
})
