<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useUsersStore } from '@/stores/users'

const store = useUsersStore()
</script>

<template>
  <div class="app">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="brand">Usuarios <span>/ Vue</span></RouterLink>
        <p class="favorite-count" role="status">Favoritos: {{ store.favoriteCount }}</p>
      </div>
    </header>
    <main id="contenido" class="main" tabindex="-1">
      <RouterView />
    </main>
    <footer class="app-footer">Programación Web</footer>
  </div>
</template>
