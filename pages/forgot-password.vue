<template>
  <div class="card p-6 space-y-5">
    <div>
      <NuxtLink to="/login" class="text-sm text-green-600 font-medium flex items-center gap-1 mb-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar ao login
      </NuxtLink>
      <h2 class="text-xl font-bold text-gray-900">Recuperar senha</h2>
      <p class="text-gray-500 text-sm mt-1">Enviaremos um link para seu e-mail</p>
    </div>

    <div v-if="sent" class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 text-center">
      ✅ E-mail enviado! Verifique sua caixa de entrada.
    </div>

    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <BaseInput
        v-model="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        required
      />

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
        {{ error }}
      </div>

      <BaseButton type="submit" :loading="loading" :full-width="true" size="lg">
        Enviar e-mail
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'auth' })

const { forgotPassword } = useAuth()

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await forgotPassword(email.value)
    sent.value = true
  } catch {
    error.value = 'Não foi possível enviar o e-mail. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
