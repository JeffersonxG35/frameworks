<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { User } from '@/types/user'

defineProps<{ user: User; favorite: boolean }>()
const emit = defineEmits<{ toggleFavorite: [id: number] }>()
</script>

<template>
  <article class="user-card">
    <h2>{{ user.name }}</h2>
    <dl class="user-data">
      <div><dt>Correo</dt><dd>{{ user.email }}</dd></div>
      <div><dt>Ciudad</dt><dd>{{ user.address.city }}</dd></div>
    </dl>
    <div class="card-actions">
      <button
        type="button"
        class="button favorite-button"
        :class="{ 'button--selected': favorite }"
        :aria-pressed="favorite"
        :aria-label="`${favorite ? 'Quitar favorito a' : 'Favorito: marcar a'} ${user.name}`"
        @click="emit('toggleFavorite', user.id)"
      >
        {{ favorite ? 'Quitar favorito' : 'Favorito' }}
      </button>
      <RouterLink :to="`/users/${user.id}`" class="detail-link" :aria-label="`Ver detalle de ${user.name}`">
        Ver detalle
      </RouterLink>
    </div>
  </article>
</template>
