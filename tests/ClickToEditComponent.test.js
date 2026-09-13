import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import ClickToEditComponent from '../src/ClickToEditComponent.vue'

const mounted = []

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
})

const factory = (props = {}) => {
    const wrapper = mount(ClickToEditComponent, { props: { value: 'Camisa', ...props }, attachTo: document.body })

    mounted.push(wrapper)

    return wrapper
}

const start = async (wrapper) => {
    await wrapper.find('button').trigger('click')
    await flushPromises()

    return wrapper.find('input')
}

describe('ClickToEditComponent', () => {
    /**
     * Antes era un <p> que solo respondía al ratón.
     */
    it('el valor es un boton, asi que se alcanza con teclado', () => {
        const button = factory().find('button')

        expect(button.text()).toBe('Camisa')
        expect(button.classes()).toEqual(['fe-editable'])
    })

    it('sin valor muestra el marcador', () => {
        expect(factory({ value: '' }).find('button').text()).toBe('—')
    })

    it('al editar muestra el valor en un campo con el foco', async () => {
        const input = await start(factory())

        expect(input.element.value).toBe('Camisa')
        expect(document.activeElement).toBe(input.element)
        expect(input.classes()).toEqual(['fe-input'])
    })

    it('Enter confirma y emite el valor', async () => {
        const wrapper = factory()
        const input = await start(wrapper)

        await input.setValue('Pantalón')
        await input.trigger('keydown', { key: 'Enter' })

        expect(wrapper.emitted('input')).toEqual([['Pantalón']])
        expect(wrapper.find('button').text()).toBe('Pantalón')
    })

    /**
     * Salir del campo lo dejaba abierto para siempre en Vue, y en React lo
     * confirmaba: el mismo componente se usaba distinto según el framework.
     */
    it('salir del campo confirma, igual que en React', async () => {
        const wrapper = factory()
        const input = await start(wrapper)

        await input.setValue('Pantalón')
        await input.trigger('blur')

        expect(wrapper.emitted('input')).toEqual([['Pantalón']])
    })

    it('Escape cancela sin emitir', async () => {
        const wrapper = factory()
        const input = await start(wrapper)

        await input.setValue('Pantalón')
        await input.trigger('keydown', { key: 'Escape' })

        expect(wrapper.emitted('input')).toBeUndefined()
        expect(wrapper.find('button').text()).toBe('Camisa')
    })

    it('un valor sin cambios no emite', async () => {
        const wrapper = factory()
        const input = await start(wrapper)

        await input.trigger('keydown', { key: 'Enter' })

        expect(wrapper.emitted('input')).toBeUndefined()
    })

    it('con save espera a que se guarde antes de cerrar', async () => {
        let release
        const save = vi.fn(() => new Promise((resolve) => { release = resolve }))
        const wrapper = factory({ save })
        const input = await start(wrapper)

        await input.setValue('Pantalón')
        await input.trigger('keydown', { key: 'Enter' })

        expect(save).toHaveBeenCalledWith('Pantalón')
        expect(wrapper.find('input').attributes('disabled')).toBeDefined()
        expect(wrapper.emitted('input')).toBeUndefined()

        release()
        await flushPromises()

        expect(wrapper.emitted('input')).toEqual([['Pantalón']])
        expect(wrapper.find('button').text()).toBe('Pantalón')
    })

    /**
     * Cerrarlo mostraría un valor que no se guardó.
     */
    it('si guardar falla se queda abierto con el error', async () => {
        const save = vi.fn(() => Promise.reject(new Error('Sin permiso')))
        const wrapper = factory({ save })
        const input = await start(wrapper)

        await input.setValue('Pantalón')
        await input.trigger('keydown', { key: 'Enter' })
        await flushPromises()

        expect(wrapper.find('input').exists()).toBe(true)
        expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
        expect(wrapper.find('[role="alert"]').text()).toBe('Sin permiso')
        expect(wrapper.emitted('input')).toBeUndefined()
    })

    it('sigue al valor que llega de fuera', async () => {
        const wrapper = factory()

        await wrapper.setProps({ value: 'Zapato' })

        expect(wrapper.find('button').text()).toBe('Zapato')
    })
})
