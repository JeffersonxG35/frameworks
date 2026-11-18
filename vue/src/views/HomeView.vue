<script setup lang="ts">
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import UserCard from '@/components/UserCard.vue'

const store = useUsersStore()

onMounted(() => {
  if (!store.loaded) void store.loadUsers()
})
</script>

<template>
  <section aria-labelledby="page-title">
    <div class="page-heading">
      <h1 id="page-title">Directorio de usuarios</h1>
    </div>

    <div class="search-field">
      <label for="search">Buscar por nombre</label>
      <input id="search" v-model="store.query" type="search" placeholder="Escribe un nombre" autocomplete="off" />
    </div>

    <div class="results" :aria-busy="store.loading">
      <p v-if="store.loading" class="message" role="status">Cargando usuarios…</p>
      <div v-else-if="store.error" class="message message--error" role="alert">
        <h2>No se pudo cargar el directorio</h2>
        <p>{{ store.error }}</p>
        <button type="button" class="button" @click="store.loadUsers()">Reintentar</button>
      </div>
      <template v-else>
        <p class="result-count" role="status">Mostrando {{ store.filteredUsers.length }} de {{ store.users.length }} usuarios</p>
        <p v-if="store.users.length === 0" class="message">La API no devolvió usuarios.</p>
        <p v-else-if="store.filteredUsers.length === 0" class="message">No hay usuarios que coincidan con tu búsqueda.</p>
        <ul v-else class="user-list">
          <li v-for="user in store.filteredUsers" :key="user.id">
            <UserCard
              :user="user"
              :favorite="store.favoriteIds.includes(user.id)"
              @toggle-favorite="store.toggleFavorite"
            />
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>
