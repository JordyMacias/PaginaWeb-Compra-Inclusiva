import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  cn,
  discountPercent,
  truncate,
  isValidEmail,
  clamp,
} from '../utils'

// =====================================================
// TESTS DE UTILIDADES
// =====================================================

describe('formatPrice', () => {
  it('formatea un precio en euros', () => {
    const result = formatPrice(29.99)
    // Verificar que contiene el número y el símbolo (independiente del tipo de espacio del locale)
    expect(result).toContain('29')
    expect(result).toContain('99')
    expect(result).toContain('€')
  })

  it('formatea cero correctamente', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('formatea precios grandes con separador', () => {
    const result = formatPrice(1000)
    // Contiene el número y el símbolo
    expect(result).toContain('1')
    expect(result).toContain('000')
    expect(result).toContain('€')
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
    expect(result.length).toBeLessThanOrEqual(15)
    expect(result.endsWith('...')).toBe(true)
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
