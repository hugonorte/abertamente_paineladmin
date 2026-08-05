<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { Author } from '~/types/models'
import { fetchAuthorById } from '~/api/author/get'
import { updateAuthor } from '~/api/author/put'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const authorId = Number(route.params.id)
const toast = useToast()
const auth = useAuth()

const state = reactive({
  name: undefined as string | undefined,
  email: undefined as string | undefined,
  bio: undefined as string | undefined,
  main_title: undefined as string | undefined,
  preferred_social_network: undefined as string | undefined,
  preferred_social_network_username: undefined as string | undefined,
})

type Schema = typeof state

// Fetch user data for protection
const user = await auth.getUser()
const userRole = user?.role || 'user'

const { data: author, pending, error } = await useAsyncData(`author-${authorId}`, () => fetchAuthorById(authorId))

watchEffect(() => {
  if (author.value) {
    // Frontend protection: Check if user is an author and is trying to edit another author's profile
    if (userRole === 'author' && author.value.email !== user?.email) {
      toast.add({
        title: 'Acesso Negado',
        description: 'Você só pode editar o seu próprio perfil de autor.',
        color: 'error',
      })
      navigateTo('/admin/dashboard')
    }

    state.name = author.value.name
    state.email = author.value.email
    state.bio = author.value.bio
    state.main_title = author.value.main_title
    state.preferred_social_network = author.value.preferred_social_network
    state.preferred_social_network_username = author.value.preferred_social_network_username
  }
})

if (error.value) {
  toast.add({
    title: 'Erro ao carregar autor',
    description: 'Não foi possível carregar os dados deste autor.',
    color: 'error',
  })
}

function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.name) errors.push({ name: 'name', message: 'O nome do autor é um campo obrigatório' })
  if (!state.email) errors.push({ name: 'email', message: 'O email do autor é um campo obrigatório' })
  if (!state.bio) errors.push({ name: 'bio', message: 'A biografia do autor é um campo obrigatório' })
  if (state.main_title && state.main_title.length < 3) errors.push({ name: 'main_title', message: 'O título principal deve ter pelo menos 3 caracteres' })
  if (state.preferred_social_network && state.preferred_social_network.length < 2) errors.push({ name: 'preferred_social_network', message: 'A rede social preferida deve ter pelo menos 2 caracteres' })
  if (state.preferred_social_network_username && state.preferred_social_network_username.length < 2) errors.push({ name: 'preferred_social_network_username', message: 'O nome de usuário deve ter pelo menos 2 caracteres' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const authorData: Partial<Author> = {
    name: event.data.name,
    email: event.data.email,
    bio: event.data.bio,
    main_title: event.data.main_title,
    preferred_social_network: event.data.preferred_social_network,
    preferred_social_network_username: event.data.preferred_social_network_username,
  }

  try {
    await updateAuthor(authorId, authorData)
    toast.add({
      title: 'Autor atualizado com sucesso!',
      color: 'success',
    })
    
    // Redirect logic: if user is merely an author, they might not have access to the authors list.
    if (userRole === 'admin' || userRole === 'editor') {
        await navigateTo('/admin/author')
    } else {
        await navigateTo('/admin/dashboard')
    }
  } catch (error) {
    toast.add({
      title: 'Erro ao atualizar autor',
      description: 'Por favor, tente novamente.',
      color: 'error',
    })
  }
}
</script>
<template>
    <UPageBody class="w-full">
      <UContainer>
        <UPageHeader title="Editar Autor" />
      </UContainer>
      
      <div v-if="pending" class="flex justify-center p-10">
        <UIcon name="i-lucide-loader-2" class="animate-spin size-8 text-primary" />
      </div>

      <UForm v-else-if="author" :validate="validate" :state="state" class="generic_form" @submit="onSubmit">
        <UContainer>
          <UCard>
            <template #header>
              <h2 class="text-lg font-medium">Informações do Autor</h2>
            </template>

            <UFormField label="Nome" name="name" class="mb-5" :ui="{ label: 'custom-label' }">
              <UInput v-model="state.name" variant="subtle" placeholder="Digite o nome do autor" class="w-full" />
            </UFormField>
            
            <UFormField label="Email" name="email" class="mb-5" :ui="{ label: 'custom-label' }">
              <UInput v-model="state.email" type="email" variant="subtle" placeholder="Digite o email do autor" class="w-full" />
            </UFormField>

            <UFormField label="Biografia" name="bio" class="mb-5" :ui="{ label: 'custom-label' }">
              <UTextarea v-model="state.bio" variant="subtle" placeholder="Digite uma breve biografia do autor" class="w-full" />
            </UFormField>

            <UFormField label="Título Profissional ou Acadêmico Principal (Ex: Doutor, Mestre, etc)" name="main_title" class="mb-5" :ui="{ label: 'custom-label' }">
              <UInput v-model="state.main_title" variant="subtle" placeholder="Digite o título principal do autor" class="w-full" />
            </UFormField>

            <UFormField label="Rede Social onde o autor é mais ativo" name="preferred_social_network" class="mb-5" :ui="{ label: 'custom-label' }">
              <UInput v-model="state.preferred_social_network" variant="subtle" placeholder="Digite a rede social preferida do autor" class="w-full" />
            </UFormField>

            <UFormField label="Nome de Usuário na Rede Social onde o autor é mais ativo" name="preferred_social_network_username" class="mb-5" :ui="{ label: 'custom-label' }">
              <UInput v-model="state.preferred_social_network_username" variant="subtle" placeholder="Digite o nome de usuário da rede social preferida do autor" class="w-full" />
            </UFormField>
            
            <template #footer>
              <UButton type="submit" color="primary">Salvar Alterações</UButton>
            </template>
          </UCard>
        </UContainer>
      </UForm>
    </UPageBody>
</template>
