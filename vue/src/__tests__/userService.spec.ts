import { afterEach, describe, expect, it, vi } from 'vitest'
import { getUsers } from '@/services/userService'

afterEach(() => vi.unstubAllGlobals())

describe('consulta a la API', () => {
  it('rechaza una respuesta HTTP de error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(getUsers()).rejects.toThrow('HTTP 500')
  })

  it('muestra un mensaje comprensible ante un fallo de red', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(getUsers()).rejects.toThrow('No se pudo conectar')
  })

  it('rechaza datos que no tienen el formato de usuario', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [{ title: 'Tarea' }] }))
    await expect(getUsers()).rejects.toThrow('formato inesperado')
  })

  it('devuelve los usuarios de una respuesta válida', async () => {
    const users = [{ id: 1, name: 'Ana', email: 'ana@example.test', address: { city: 'Cuenca' } }]
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => users })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getUsers()).resolves.toEqual(users)
    expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
  })
})
