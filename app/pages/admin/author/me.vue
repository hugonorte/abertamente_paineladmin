<script setup lang="ts">
import { fetchAuthors } from '~/api/author/get'
import type { User } from '~/types/models'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const auth = useAuth()
const user = await auth.getUser() as User | null
const toast = useToast()

const { data: authors, pending, error } = await useAsyncData('authors-list', () => fetchAuthors())

watchEffect(() => {
  if (authors.value) {
    const author = authors.value.find(a => a.email === user?.email)
    
    if (author && author.id) {
      navigateTo(`/admin/author/${author.id}`)
    } else {
      toast.add({
        title: 'Perfil não encontrado',
        description: 'Não foi possível localizar o seu perfil de autor.',
        color: 'error',
      })
      navigateTo('/admin/dashboard')
    }
  }
})

if (error.value) {
  toast.add({
    title: 'Erro de conexão',
    description: 'Não foi possível conectar com o servidor para buscar o perfil.',
    color: 'error',
  })
  navigateTo('/admin/dashboard')
}
</script>

<template>
  <UPageBody class="w-full flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center">
      <UIcon name="i-lucide-loader-2" class="animate-spin size-8 text-primary mb-4" />
      <p class="text-gray-500">Localizando o seu perfil de autor...</p>
    </div>
  </UPageBody>
</template>
