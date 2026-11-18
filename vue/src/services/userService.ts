import type { User } from '@/types/user'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false
  const user = value as Record<string, unknown>
  const address = user.address

  return (
    typeof user.id === 'number' &&
    Number.isFinite(user.id) &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof address === 'object' &&
    address !== null &&
    'city' in address &&
    typeof address.city === 'string'
  )
}

export async function getUsers(): Promise<User[]> {
  let response: Response
  try {
    response = await fetch(API_URL)
  } catch {
    throw new Error('No se pudo conectar con la API. Revisa tu conexión e inténtalo de nuevo.')
  }

  if (!response.ok) {
    throw new Error(`No se pudieron cargar los usuarios (HTTP ${response.status}).`)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('La API devolvió una respuesta que no es JSON válido.')
  }

  if (!Array.isArray(data) || !data.every(isUser)) {
    throw new Error('La API devolvió usuarios con un formato inesperado.')
  }

  return data
}
