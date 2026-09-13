import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)

    return entry.isDirectory() ? walk(full) : [full]
})

/**
 * Lo que tiene forma de utilidad de Tailwind: un prefijo de variante
 * (`dark:`, `hover:`) delante de algo, o una familia de utilidades conocida.
 * Las clases propias empiezan por `fe-` y nunca encajan.
 */
const UTILITY = new RegExp([
    '^(?:[a-z-]+:)+\\S+$',
    '^-?(?:m|p)[trblxy]?-\\S+$',
    '^(?:gap|space)-\\S+$',
    '^(?:w|h|min-w|min-h|max-w|max-h|size)-\\S+$',
    '^(?:text|bg|border|ring|outline|shadow|rounded|font|leading|tracking|opacity|duration|ease|delay|z|inset|top|right|bottom|left|object|cursor|items|justify|self|place|grid-cols|col-span|order|divide|fill|stroke)-\\S+$',
    '^(?:flex|inline-flex|grid|block|inline-block|hidden|relative|absolute|fixed|sticky|border|rounded|shadow|transition|truncate|uppercase|lowercase|capitalize|italic|underline)$',
].join('|'))

/** Los valores de class, :class, className y custom-class del archivo. */
const classTokens = (source) => [...source.matchAll(/(?:\bclass|\bclassName|\bcustom-class)=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g)]
    .flatMap((match) => (match[1] ?? match[2] ?? match[3] ?? '').split(/\s+/))
    .filter((token) => token !== '' && ! token.includes('${'))
    .map((token) => token.replace(/^['"`[({]+|['"`\]),}]+$/g, ''))

describe('clases de los componentes', () => {
    /**
     * Los componentes pintaban etiquetas, grupos, zonas de archivos y
     * casillas con clases de Tailwind que el paquete no declara: en una
     * aplicación sin Tailwind salían sin estilo, y el modo oscuro iba escrito
     * a mano en cada una. El aspecto sale del tema de innoboxrr-form-core.
     */
    it('ningun componente usa utilidades de Tailwind', () => {
        const offenders = walk(path.join(root, 'src'))
            .filter((file) => /\.(vue|jsx?)$/.test(file))
            .flatMap((file) => classTokens(fs.readFileSync(file, 'utf8'))
                .filter((token) => UTILITY.test(token))
                .map((token) => `${path.relative(root, file)}: ${token}`))

        expect(offenders).toEqual([])
    })

    it('la comprobacion reconoce una utilidad y respeta las clases propias', () => {
        const tokens = classTokens('<label class="ml-2 text-sm dark:text-white fe-label"></label>')

        expect(tokens.filter((token) => UTILITY.test(token))).toEqual(['ml-2', 'text-sm', 'dark:text-white'])
        expect(classTokens(':class="{ error: !isValid }"').filter((token) => UTILITY.test(token))).toEqual([])
    })
})
