<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'

const route = useRoute()
const store = useUsersStore()
const user = computed(() => store.users.find((item) => String(item.id) === route.params.id))

onMounted(() => {
  if (!store.loaded) void store.loadUsers()
})
</script>

<template>
  <section aria-labelledby="detail-title" class="detail-page">
    <RouterLink to="/" class="back-link">Volver al directorio</RouterLink>
    <h1 id="detail-title">Detalle del usuario</h1>
    <div class="results" :aria-busy="store.loading">
      <p v-if="store.loading" class="message" role="status">Cargando usuario…</p>
      <div v-else-if="store.error" class="message message--error" role="alert">
        <p>{{ store.error }}</p>
        <button type="button" class="button" @click="store.loadUsers()">Reintentar</button>
      </div>
      <article v-else-if="user" class="user-card detail-card">
        <h2>{{ user.name }}</h2>
        <dl class="user-data">
          <div><dt>Identificador</dt><dd>{{ user.id }}</dd></div>
          <div><dt>Correo</dt><dd>{{ user.email }}</dd></div>
          <div><dt>Ciudad</dt><dd>{{ user.address.city }}</dd></div>
        </dl>
        <p>{{ store.favoriteIds.includes(user.id) ? 'Este usuario está en tus favoritos.' : 'Este usuario aún no está en tus favoritos.' }}</p>
        <button
          type="button"
          class="button"
          :class="{ 'button--selected': store.favoriteIds.includes(user.id) }"
          :aria-pressed="store.favoriteIds.includes(user.id)"
          @click="store.toggleFavorite(user.id)"
        >
          {{ store.favoriteIds.includes(user.id) ? 'Quitar favorito' : 'Favorito' }}
        </button>
      </article>
      <p v-else class="message">Usuario no encontrado.</p>
    </div>
  </section>
</template>
