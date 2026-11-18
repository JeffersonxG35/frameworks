import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { filterUsers, useUsersStore } from '@/stores/users'
import { getUsers } from '@/services/userService'
import type { User } from '@/types/user'

vi.mock('@/services/userService', () => ({ getUsers: vi.fn() }))

const sample: User[] = [
  { id: 1, name: 'Ana Pérez', email: 'ana@example.test', address: { city: 'Cuenca' } },
  { id: 2, name: 'Luis Mora', email: 'luis@example.test', address: { city: 'Quito' } },
]

beforeEach(() => {
  setActivePinia(createPinia())
  vi.resetAllMocks()
})

describe('búsqueda de usuarios', () => {
  it('busca por nombre ignorando mayúsculas y espacios exteriores', () => {
    expect(filterUsers(sample, '  ANA  ')).toEqual([sample[0]])
    expect(filterUsers(sample, '')).toEqual(sample)
    expect(filterUsers(sample, 'inexistente')).toEqual([])
  })
})

describe('estado de usuarios', () => {
  it('activa la carga mientras espera y guarda la respuesta', async () => {
    let resolveRequest!: (users: User[]) => void
    vi.mocked(getUsers).mockReturnValue(new Promise((resolve) => { resolveRequest = resolve }))
    const store = useUsersStore()
    const pending = store.loadUsers()

    expect(store.loading).toBe(true)
    resolveRequest(sample)
    await pending

    expect(store.users).toEqual(sample)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.loaded).toBe(true)
  })

  it('permite reintentar después de un error', async () => {
    vi.mocked(getUsers).mockRejectedValueOnce(new Error('Sin conexión')).mockResolvedValueOnce(sample)
    const store = useUsersStore()
    await store.loadUsers()
    expect(store.error).toBe('Sin conexión')
    expect(store.loading).toBe(false)
    expect(store.loaded).toBe(false)

    await store.loadUsers()
    expect(store.error).toBeNull()
    expect(store.users).toEqual(sample)
  })

  it('agrega y quita favoritos sin perder el contador al buscar', async () => {
    vi.mocked(getUsers).mockResolvedValue(sample)
    const store = useUsersStore()
    await store.loadUsers()
    store.toggleFavorite(1)
    store.query = 'Luis'

    expect(store.favoriteCount).toBe(1)
    expect(store.filteredUsers).toEqual([sample[1]])

    store.toggleFavorite(1)
    store.toggleFavorite(999)
    expect(store.favoriteCount).toBe(0)
  })
})
