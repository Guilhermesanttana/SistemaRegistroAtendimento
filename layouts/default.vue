<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <main class="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-safe">
      <slot />
    </main>
  </div>
</template>
