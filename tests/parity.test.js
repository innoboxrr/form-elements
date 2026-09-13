import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * El generador emite los mismos nombres de componente para Vue y para React.
 * Si uno existe en un paquete y no en el otro, el módulo generado de ese
 * framework no compila, y nadie lo descubre hasta el build.
 *
 * La lista vive escrita aquí y en el gemelo React, porque en CI solo se clona
 * cada repositorio. Cuando el hermano está a mano —en el monorepo— se compara
 * además con él.
 *
 * Se lee el código del índice en vez de importarlo: importarlo cargaría
 * CodeMirror, TinyMCE y vue-select solo para contar nombres.
 */
const CANONICAL = [
    'AvatarInputComponent',
    'ButtonComponent',
    'CheckboxInputComponent',
    'ClickToEditComponent',
    'CodeInputComponent',
    'CodeMirrorComponent',
    'ColorPickerInputComponent',
    'CommandPaletteComponent',
    'ConfirmHostComponent',
    'CountrySelectInputComponent',
    'DialogComponent',
    'DrawerComponent',
    'DynamicGroupInputComponent',
    'EditorInputComponent',
    'FileDropInputComponent',
    'FileInputComponent',
    'FqsInputComponent',
    'IconComponent',
    'InputErrorComponent',
    'MenuComponent',
    'ModelSearchInputComponent',
    'MultiCheckboxInputComponent',
    'PolymorphicInputComponent',
    'RadioInputComponent',
    'SelectInputComponent',
    'SelectSearchInputComponent',
    'SimpleFileInputComponent',
    'SingleCheckboxInputComponent',
    'SkeletonComponent',
    'StarsInputComponent',
    'SwitchComponent',
    'TagsInputComponent',
    'TextEditorMonoStyleInputComponent',
    'TextInputComponent',
    'TextareaInputComponent',
    'TimezoneSelectInputComponent',
    'ToastRegionComponent',
].sort()

const index = readFileSync(resolve(import.meta.dirname, '../index.js'), 'utf8')

describe('paridad con innoboxrr-react-form-elements', () => {
    it('exporta exactamente los componentes de la lista canonica', () => {
        const block = index.slice(index.lastIndexOf('export {'))

        const exported = block
            .replace(/export\s*\{|\}/g, '')
            .split(',')
            .map((name) => name.trim())
            .filter(Boolean)
            .sort()

        expect(exported).toEqual(CANONICAL)
    })

    /**
     * El plugin registra los componentes con nombre para usarlos sin importar.
     * Uno exportado y no registrado funciona importándolo y falla en la
     * plantilla que lo da por global.
     */
    it('install registra los mismos componentes', () => {
        const registered = [...index.matchAll(/app\.component\('([A-Za-z]+)'/g)].map((match) => match[1]).sort()

        expect(registered).toEqual(CANONICAL)
    })

    it('la rama React exporta lo mismo, cuando esta a mano', () => {
        const path = resolve(import.meta.dirname, '../../react-form-elements/index.js')

        if (! existsSync(path)) {
            return
        }

        const react = [...readFileSync(path, 'utf8').matchAll(/export \{ default as ([A-Za-z]+) \}/g)]
            .map((match) => match[1])
            .sort()

        expect(react).toEqual(CANONICAL)
    })
})
