<template>
  <header class="bg-white border-b border-gray-100 sticky top-0 z-40">
    <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <span class="font-bold text-gray-900 text-lg">TEA Registro</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <NuxtLink to="/profile" class="w-9 h-9 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
          <img v-if="professional?.foto" :src="professional.foto" class="w-full h-full object-cover" :alt="professional.nome" />
          <span v-else class="text-green-700 font-semibold text-sm">{{ initials }}</span>
        </NuxtLink>
        <button @click="logout" class="p-2 text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { professional, logout } = useAuth()

const initials = computed(() => {
  if (!professional.value?.nome) return '?'
  return professional.value.nome.split(' ').slice(0, 2).map((name) => name[0]).join('').toUpperCase()
})
</script>
