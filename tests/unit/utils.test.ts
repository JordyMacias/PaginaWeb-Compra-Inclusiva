import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  cn,
  generateId,
  discountPercent,
  truncate,
  isValidEmail,
  clamp,
} from '../../frontend/src/utils'

// =====================================================
// TESTS DE UTILIDADES
// =====================================================

describe('formatPrice', () => {
  it('formatea un precio en euros', () => {
    expect(formatPrice(29.99)).toBe('29,99 €')
  })

  it('formatea cero correctamente', () => {
    expect(formatPrice(0)).toBe('0,00 €')
  })

  it('formatea precios grandes con separador de miles', () => {
    const result = formatPrice(1000)
    expect(result).toContain('1.000')
  })
})

describe('cn (classNames)', () => {
  it('combina clases', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('omite valores falsy', () => {
    expect(cn('a', null, undefined, false, 'b')).toBe('a b')
  })
})

describe('discountPercent', () => {
  it('calcula porcentaje de descuento', () => {
    expect(discountPercent(100, 75)).toBe(25)
  })

  it('devuelve 0 si el original es 0', () => {
    expect(discountPercent(0, 10)).toBe(0)
  })
})

describe('truncate', () => {
  it('trunca texto largo', () => {
    const result = truncate('Texto muy largo que supera el límite', 15)
    expect(result).toBe('Texto muy lar...')
    expect(result.length).toBe(15)
  })

  it('no trunca texto corto', () => {
    expect(truncate('Corto', 50)).toBe('Corto')
  })
})

describe('isValidEmail', () => {
  it('valida emails correctos', () => {
    expect(isValidEmail('test@ejemplo.es')).toBe(true)
    expect(isValidEmail('usuario+tag@dominio.com')).toBe(true)
  })

  it('rechaza emails incorrectos', () => {
    expect(isValidEmail('no-es-email')).toBe(false)
    expect(isValidEmail('@sin-usuario.com')).toBe(false)
    expect(isValidEmail('sin-dominio@')).toBe(false)
  })
})

describe('clamp', () => {
  it('limita valores dentro del rango', () => {
    expect(clamp(5, 1, 10)).toBe(5)
    expect(clamp(0, 1, 10)).toBe(1)
    expect(clamp(15, 1, 10)).toBe(10)
  })
})
