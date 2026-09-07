import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { defaultTheme, resetTheme, setTheme } from 'innoboxrr-form-core'

import ButtonComponent from '../src/ButtonComponent.vue'
import CheckboxInputComponent from '../src/CheckboxInputComponent.vue'
import InputErrorComponent from '../src/InputErrorComponent.vue'
import RadioInputComponent from '../src/RadioInputComponent.vue'
import SelectInputComponent from '../src/SelectInputComponent.vue'
import TextInputComponent from '../src/TextInputComponent.vue'
import TextareaInputComponent from '../src/TextareaInputComponent.vue'

afterEach(() => resetTheme())

/**
 * Las clases estaban incrustadas en cada componente, repetidas ademas en el
 * gemelo React; y el codigo generado esperaba `inputClass` y `buttonClass` de
 * un mixin global que nadie declaraba.
 *
 * Ahora hay un tema compartido con el gemelo, en innoboxrr-form-core.
 */
describe('tema', () => {
    it('los controles arrancan con las clases del tema', () => {
        const input = mount(TextInputComponent, { props: { type: 'text', name: 'a' } }).find('input')

        expect(input.classes()).toEqual(expect.arrayContaining(defaultTheme.input.split(' ')))
    })

    it('setTheme cambia el aspecto de todo el proyecto', () => {
        setTheme({ input: 'form-control', button: 'btn btn-primary' })

        expect(mount(TextInputComponent, { props: { type: 'text', name: 'a' } }).find('input').classes())
            .toContain('form-control')

        expect(mount(ButtonComponent, { props: { value: 'Guardar' } }).find('button').classes())
            .toEqual(expect.arrayContaining(['btn', 'btn-primary']))
    })

    it('customClass sigue mandando para el caso puntual', () => {
        setTheme({ input: 'form-control' })

        const input = mount(TextInputComponent, {
            props: { type: 'text', name: 'a', customClass: 'especial' },
        }).find('input')

        expect(input.classes()).toContain('especial')
        expect(input.classes()).not.toContain('form-control')
    })

    /**
     * El tema es estado de modulo, fuera de Vue: sin la suscripcion, cambiarlo
     * con la aplicacion ya montada no repintaria nada.
     */
    it('un cambio en caliente repinta lo ya montado', async () => {
        const wrapper = mount(TextInputComponent, { props: { type: 'text', name: 'a' } })

        expect(wrapper.find('input').classes()).toContain('uk-input')

        setTheme({ input: 'oscuro' })
        await nextTick()

        expect(wrapper.find('input').classes()).toContain('oscuro')
        expect(wrapper.find('input').classes()).not.toContain('uk-input')
    })

    it('cada control lee su propio token', () => {
        setTheme({ input: 'i', select: 's', textarea: 't', checkbox: 'c', radio: 'r' })

        expect(mount(TextInputComponent, { props: { type: 'text', name: 'a' } }).find('input').classes())
            .toContain('i')
        expect(mount(SelectInputComponent, { props: { name: 'b' } }).find('select').classes())
            .toContain('s')
        expect(mount(TextareaInputComponent, { props: { name: 'c' } }).find('textarea').classes())
            .toContain('t')
        expect(mount(CheckboxInputComponent, { props: { name: 'd' } }).find('input').classes())
            .toContain('c')
        expect(mount(RadioInputComponent, { props: { name: 'e', val: 'x' } }).find('input').classes())
            .toContain('r')
    })

    it('alcanza a los mensajes de error', () => {
        setTheme({ error: 'mensaje-error' })

        const wrapper = mount(InputErrorComponent, {
            props: { errors: { a: ['Requerido'] }, type: 'a' },
        })

        expect(wrapper.find('p').classes()).toContain('mensaje-error')
    })

    it('resetTheme vuelve a fabrica', () => {
        setTheme({ input: 'x' })
        resetTheme()

        expect(mount(TextInputComponent, { props: { type: 'text', name: 'a' } }).find('input').classes())
            .toContain('uk-input')
    })
})

describe('variantes de boton', () => {
    it('cada variante lee su propio token', () => {
        setTheme({
            button: 'primario',
            buttonSecondary: 'secundario',
            buttonDanger: 'peligro',
            buttonLink: 'enlace',
        })

        const classOf = (variant) => mount(ButtonComponent, {
            props: { value: 'x', variant },
        }).find('button').classes()

        expect(classOf('primary')).toContain('primario')
        expect(classOf('secondary')).toContain('secundario')
        expect(classOf('danger')).toContain('peligro')
        expect(classOf('link')).toContain('enlace')
    })

    it('una variante desconocida cae al boton primario', () => {
        setTheme({ button: 'primario' })

        expect(mount(ButtonComponent, { props: { value: 'x', variant: 'inventada' } }).find('button').classes())
            .toContain('primario')
    })

    it('sin variante es primario', () => {
        expect(mount(ButtonComponent, { props: { value: 'x' } }).find('button').classes())
            .toEqual(expect.arrayContaining(defaultTheme.button.split(' ')))
    })
})
