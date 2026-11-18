import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUsers } from '@/services/userService'
import type { User } from '@/types/user'

export function filterUsers(users: User[], query: string): User[] {
  const search = query.trim().toLocaleLowerCase('es')
  return users.filter((user) => user.name.toLocaleLowerCase('es').includes(search))
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const query = ref('')
  const favoriteIds = ref<number[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const filteredUsers = computed(() => filterUsers(users.value, query.value))
  const favoriteCount = computed(() => favoriteIds.value.length)

  async function loadUsers() {
    if (loading.value) return
    loading.value = true
    error.value = null

    try {
      users.value = await getUsers()
      favoriteIds.value = favoriteIds.value.filter((id) => users.value.some((user) => user.id === id))
      loaded.value = true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'No se pudieron cargar los usuarios.'
    } finally {
      loading.value = false
    }
  }

  function toggleFavorite(id: number) {
    if (!users.value.some((user) => user.id === id)) return
    favoriteIds.value = favoriteIds.value.includes(id)
      ? favoriteIds.value.filter((favoriteId) => favoriteId !== id)
      : [...favoriteIds.value, id]
  }

  return {
    users,
    query,
    favoriteIds,
    loading,
    error,
    loaded,
    filteredUsers,
    favoriteCount,
    loadUsers,
    toggleFavorite,
  }
})
