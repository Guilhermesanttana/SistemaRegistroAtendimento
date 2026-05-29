<template>
  <div class="card p-6 space-y-4 text-center">
    <div class="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div>
      <h1 class="text-xl font-bold text-gray-900">Redefinição de senha</h1>
      <p class="text-sm text-gray-500 mt-1">
        Configure a tela de atualização de senha do Supabase quando conectar este projeto ao backend real.
      </p>
    </div>
    <NuxtLink to="/login" class="btn-primary">
      Voltar ao login
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'auth' })
</script>
