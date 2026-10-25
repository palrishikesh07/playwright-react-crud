
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

function TestConsumer() {
  const { user, register, login, logout } = useAuth()

  return (
    <div>
      <p data-testid="current-user">
        {user?.email ?? 'Not logged in'}
      </p>

      <button
        onClick={() =>
          register('Test User', 'test@example.com', 'Password123')
        }
      >
        Register
      </button>

      <button
        onClick={() => login('test@example.com', 'Password123')}
      >
        Login
      </button>

      <button onClick={logout}>Logout</button>

      <button
        onClick={() =>
          register('Another User', 'test@example.com', 'Password123')
        }
      >
        Register duplicate
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  function renderAuth() {
    return render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
  }

  it('registers a new user and logs them in', () => {
    renderAuth()

    fireEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(screen.getByTestId('current-user'))
      .toHaveTextContent('test@example.com')

    const users = JSON.parse(
      localStorage.getItem('shopease_users') || '[]',
    )

    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('test@example.com')
  })

  it('does not allow duplicate email registration', () => {
    renderAuth()

    fireEvent.click(screen.getByRole('button', { name: 'Register' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Register duplicate' }),
    )

    const users = JSON.parse(
      localStorage.getItem('shopease_users') || '[]',
    )

    expect(users).toHaveLength(1)
  })

  it('logs out the current user', () => {
    renderAuth()

    fireEvent.click(screen.getByRole('button', { name: 'Register' }))
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }))

    expect(screen.getByTestId('current-user'))
      .toHaveTextContent('Not logged in')
  })

  it('rejects invalid login credentials', () => {
    renderAuth()

    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByTestId('current-user'))
      .toHaveTextContent('Not logged in')
  })
})
