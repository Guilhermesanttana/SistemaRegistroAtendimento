<template>
  <div class="space-y-5">
    <h1 class="text-2xl font-bold text-gray-900">Meu Perfil</h1>

    <div v-if="professional" class="space-y-4">
      <div class="card p-5 flex flex-col items-center gap-3">
        <div class="w-24 h-24 rounded-3xl overflow-hidden bg-green-100 flex items-center justify-center">
          <img v-if="professional.foto" :src="professional.foto" class="w-full h-full object-cover" :alt="professional.nome" />
          <span v-else class="text-green-700 font-black text-3xl">{{ initials }}</span>
        </div>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-900">{{ professional.nome }}</h2>
          <p class="text-gray-500 text-sm">{{ professional.especialidade || 'Psicólogo(a)' }}</p>
          <p v-if="professional.crp" class="text-gray-400 text-xs mt-0.5">CRP {{ professional.crp }}</p>
        </div>
      </div>

      <div class="card divide-y divide-gray-50">
        <div class="p-4">
          <p class="text-xs text-gray-400 uppercase tracking-wide">E-mail</p>
          <p class="text-gray-900 mt-0.5">{{ professional.email }}</p>
        </div>
        <div v-if="professional.telefone" class="p-4">
          <p class="text-xs text-gray-400 uppercase tracking-wide">Telefone</p>
          <p class="text-gray-900 mt-0.5">{{ professional.telefone }}</p>
        </div>
        <div v-if="professional.observacoes" class="p-4">
          <p class="text-xs text-gray-400 uppercase tracking-wide">Observações</p>
          <p class="text-gray-900 mt-0.5">{{ professional.observacoes }}</p>
        </div>
      </div>

      <BaseButton variant="secondary" :full-width="true" @click="logout">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sair da conta
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { professional, logout } = useAuth()

const initials = computed(() => {
  if (!professional.value?.nome) return '?'
  return professional.value.nome.split(' ').slice(0, 2).map((name) => name[0]).join('').toUpperCase()
})
</script>
