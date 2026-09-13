import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'

const { default: CountrySelectInputComponent } = await import('../src/CountrySelectInputComponent.vue')

const mounted = []

afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount())
})

const mountPhone = async (props = {}) => {
    const wrapper = mount(CountrySelectInputComponent, {
        props: { label: 'Teléfono', defaultCountry: 'MX', ...props },
        attachTo: document.body,
    })

    mounted.push(wrapper)

    await flushPromises()

    return wrapper
}

describe('CountrySelectInputComponent', () => {
    /**
     * La etiqueta y el campo llevaban clases de Tailwind y colores escritos:
     * fuera de una aplicación con Tailwind salían sin forma.
     */
    it('se pinta con el tema', async () => {
        const wrapper = await mountPhone()

        expect(wrapper.find('label').classes()).toContain('fe-label')
        expect(wrapper.find('.vue-tel-input').classes()).toContain('fe-phone')
        expect(wrapper.find('input[type="tel"]').classes()).not.toContain('bg-gray-50')
    })

    it('la etiqueta apunta al campo', async () => {
        const wrapper = await mountPhone()

        expect(wrapper.find('label').attributes('for')).toBe(wrapper.find('input[type="tel"]').attributes('id'))
    })

    it('marca el error con un numero incompleto', async () => {
        const wrapper = await mountPhone()

        await wrapper.find('input[type="tel"]').setValue('55')

        expect(wrapper.find('.vue-tel-input').classes()).toContain('fe-phone-invalid')
    })

    /**
     * Hay formularios que guardan `phone` y `country.dialCode` tal cual: lo
     * que emite no puede cambiar por arreglar el aspecto.
     */
    it('emite lo mismo que antes', async () => {
        const wrapper = await mountPhone()

        await wrapper.find('input[type="tel"]').setValue('5512345678')
        await flushPromises()

        const last = wrapper.emitted('change').at(-1)[0]

        expect(last.isValid).toBe(true)
        expect(last.phone).toBe('5512345678')
        expect(last.country).toEqual(expect.objectContaining({ iso2: 'MX', dialCode: '52' }))
    })

    /**
     * Antes valía cualquier número de 10 dígitos: un móvil español no se
     * podía guardar y un número mexicano imposible sí.
     */
    it('valida segun el pais elegido', async () => {
        const spain = await mountPhone({ defaultCountry: 'ES' })

        await spain.find('input[type="tel"]').setValue('612345678')
        await flushPromises()

        const last = spain.emitted('change').at(-1)[0]

        expect(last).toEqual({ phone: '612345678', country: expect.objectContaining({ iso2: 'ES', dialCode: '34' }), isValid: true })

        const mexico = await mountPhone()

        await mexico.find('input[type="tel"]').setValue('1234567890')
        await flushPromises()

        expect(mexico.find('.vue-tel-input').classes()).toContain('fe-phone-invalid')
        expect((mexico.emitted('change') ?? []).some(([payload]) => payload.isValid)).toBe(false)
    })

    it('emite el numero nacional aunque se escriba con prefijo', async () => {
        const wrapper = await mountPhone()

        await wrapper.find('input[type="tel"]').setValue('+52 55 1234 5678')
        await flushPromises()

        const last = wrapper.emitted('change').at(-1)[0]

        expect(last.isValid).toBe(true)
        expect(last.phone).toBe('5512345678')
    })

    /**
     * En la misma aplicación, como en una página real: useId() numera por
     * aplicación, así que dos montajes sueltos pueden repetir id sin que eso
     * pase nunca en un formulario.
     */
    it('dos telefonos no comparten id', async () => {
        const wrapper = mount({
            render: () => h('div', [
                h(CountrySelectInputComponent, { label: 'Teléfono' }),
                h(CountrySelectInputComponent, { label: 'WhatsApp' }),
            ]),
        }, { attachTo: document.body })

        mounted.push(wrapper)

        await flushPromises()

        const ids = wrapper.findAll('input[type="tel"]').map((input) => input.attributes('id'))

        expect(ids).toHaveLength(2)
        expect(ids[0]).not.toBe(ids[1])
    })
})
