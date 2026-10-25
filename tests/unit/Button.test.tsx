import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../../frontend/src/components/common/Button'

// =====================================================
// TESTS DEL COMPONENTE BUTTON
// Verifican accesibilidad y comportamiento correcto.
// =====================================================

describe('Button', () => {
  it('renderiza el texto del botón', () => {
    render(<Button>Añadir al carrito</Button>)
    expect(screen.getByRole('button', { name: 'Añadir al carrito' })).toBeInTheDocument()
  })

  it('responde a clics', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Comprar</Button>)
    await user.click(screen.getByRole('button', { name: 'Comprar' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('está desactivado cuando disabled=true', () => {
    render(<Button disabled>Botón desactivado</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('no responde a clics cuando está desactivado', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Botón</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('muestra estado de carga con aria-busy', () => {
    render(<Button isLoading loadingText="Procesando...">Guardar</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Procesando...')).toBeInTheDocument()
  })

  it('responde a la tecla Enter (accesibilidad de teclado)', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Confirmar</Button>)
    const btn = screen.getByRole('button')
    btn.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalled()
  })
})
