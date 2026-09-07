import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import TextInputComponent from '../src/TextInputComponent.vue'

const factory = (props = {}) => mount(TextInputComponent, {
    props: { type: 'text', name: 'title', ...props },
})

describe('TextInputComponent', () => {

    it('pinta la etiqueta y los atributos del input', () => {
        const wrapper = factory({
            label: 'Titulo',
            placeholder: 'Escribe el titulo',
            validators: 'required length',
            min_length: 3,
            max_length: 130,
        })

        expect(wrapper.find('label').text()).toContain('Titulo')

        const input = wrapper.find('input')

        expect(input.attributes('type')).toBe('text')
        expect(input.attributes('name')).toBe('title')
        expect(input.attributes('placeholder')).toBe('Escribe el titulo')
        expect(input.attributes('data-validators')).toBe('required length')
        expect(input.attributes('data-min_length')).toBe('3')
        expect(input.attributes('data-max_length')).toBe('130')
    })

    it('aplica la clase por defecto y la personalizada', () => {
        expect(factory().find('input').classes()).toContain('uk-input')

        expect(factory({ customClass: 'mi-clase' }).find('input').classes()).toContain('mi-clase')
    })

    it('refleja modelValue y emite update:modelValue', async () => {
        const wrapper = factory({ modelValue: 'hola' })

        expect(wrapper.find('input').element.value).toBe('hola')

        await wrapper.find('input').setValue('adios')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['adios'])
    })

    it('reemite los eventos del input', async () => {
        const wrapper = factory()
        const input = wrapper.find('input')

        await input.trigger('focus')
        await input.trigger('blur')
        await input.trigger('paste')
        await input.trigger('keyup.enter')

        expect(wrapper.emitted('focus')).toBeTruthy()
        expect(wrapper.emitted('blur')).toBeTruthy()
        expect(wrapper.emitted('paste')).toBeTruthy()
        expect(wrapper.emitted('enter')).toBeTruthy()
    })

    it('muestra el icono solo cuando se le pasa uno', () => {
        expect(factory().find('.uk-form-icon').exists()).toBe(false)

        const wrapper = factory({ icon: 'user' })

        expect(wrapper.find('.uk-form-icon').attributes('uk-icon')).toBe('icon: user')
    })

    it('muestra la ayuda como tooltip', () => {
        expect(factory().find('.fa-circle-question').exists()).toBe(false)

        const wrapper = factory({ help: 'Un texto de ayuda' })

        expect(wrapper.find('.fa-circle-question').attributes('uk-tooltip'))
            .toBe('title: Un texto de ayuda')
    })

    describe('cuando el tipo es password', () => {

        it('ofrece un boton para alternar la visibilidad', async () => {
            const wrapper = factory({ type: 'password' })

            const toggle = wrapper.find('.fe-password-toggle')

            expect(toggle.exists()).toBe(true)
            expect(wrapper.find('input').attributes('type')).toBe('password')

            await toggle.trigger('click')

            expect(wrapper.find('input').attributes('type')).toBe('text')

            await toggle.trigger('click')

            expect(wrapper.find('input').attributes('type')).toBe('password')
        })

        it('no ofrece el boton para los demas tipos', () => {
            expect(factory({ type: 'text' }).find('.fe-password-toggle').exists()).toBe(false)
        })

    })

    it('da a cada instancia de la misma app un identificador propio', () => {
        // useId() garantiza unicidad dentro de una aplicacion, que es el
        // escenario real: dos campos del mismo formulario.
        const wrapper = mount({
            components: { TextInputComponent },
            template: `
                <form>
                    <TextInputComponent type="text" name="uno" />
                    <TextInputComponent type="text" name="dos" />
                </form>
            `,
        })

        const [uno, dos] = wrapper.findAll('input').map((input) => input.attributes('data-uid'))

        expect(uno).toBeTruthy()
        expect(dos).toBeTruthy()
        expect(uno).not.toBe(dos)
    })

})
