<template>
  <div class="card p-6 space-y-5">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Entrar</h2>
      <p class="text-gray-500 text-sm mt-1">Acesso exclusivo para profissionais</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <BaseInput
        v-model="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        autocomplete="email"
        required
        :error="errors.email"
      />

      <div>
        <BaseInput
          v-model="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          required
          :error="errors.password"
        />
        <div class="flex justify-end mt-1">
          <NuxtLink to="/forgot-password" class="text-sm text-green-600 font-medium">
            Esqueci minha senha
          </NuxtLink>
        </div>
      </div>

      <div v-if="authError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
        {{ authError }}
      </div>

      <BaseButton type="submit" :loading="loading" :full-width="true" size="lg">
        Entrar
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
const { login, loading } = useAuth()

const email = ref('')
const password = ref('')
const authError = ref('')
const errors = ref<{ email?: string; password?: string }>({})

async function handleLogin() {
  errors.value = {}
  authError.value = ''

  if (!email.value) {
    errors.value.email = 'E-mail obrigatório'
    return
  }

  if (!password.value) {
    errors.value.password = 'Senha obrigatória'
    return
  }

  try {
    await login(email.value, password.value)
  } catch {
    authError.value = 'E-mail ou senha incorretos. Tente novamente.'
  }
}
</script>
