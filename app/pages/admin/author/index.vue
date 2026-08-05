<script setup lang="ts">
import { ref, onMounted, h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Author, User } from '~/types/models'
import { fetchAuthors } from '~/api/author/get'
import { deleteAuthor } from '~/api/author/delete'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const auth = useAuth()
const user = await auth.getUser() as User | null
const userRole = user?.role || 'user'
const userEmail = user?.email || ''

const Authors = ref<Author[]>([])
const isLoading = ref<boolean>(false)
const globalFilter = ref('')

const isDeleteModalOpen = ref(false)
const authorToDelete = ref<number | null>(null)
const isDeleting = ref(false)

const loadAuthors = async () => {
  isLoading.value = true
  try {
    Authors.value = await fetchAuthors()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = (id: number) => {
  authorToDelete.value = id
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  if (authorToDelete.value !== null) {
    isDeleting.value = true
    try {
      await deleteAuthor(authorToDelete.value)
      await loadAuthors()
      isDeleteModalOpen.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isDeleting.value = false
      authorToDelete.value = null
    }
  }
}

onMounted(async () => {
  await loadAuthors()
})

const columns: TableColumn<Author>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const authorId = row.original.id
      const authorEmail = row.original.email
      const buttons = []

      // Lógica para exibição do botão Editar
      // Admin pode editar todos, Autor/Editor podem editar apenas se for o próprio perfil
      const canEdit = userRole === 'admin' || ((userRole === 'author' || userRole === 'editor') && authorEmail === userEmail)
      
      // Lógica para exibição do botão Deletar
      // Apenas Admin pode deletar
      const canDelete = userRole === 'admin'

      if (canEdit) {
        buttons.push(
          h(resolveComponent('UButton'), { 
            color: 'primary', 
            size: 'sm', 
            icon: "i-lucide-pencil",
            onClick: () => navigateTo(`/admin/author/${authorId}`),
            label: "Editar"
          })
        )
      }

      if (canDelete) {
        buttons.push(
          h(resolveComponent('UButton'), {
            color: 'red',
            variant: 'soft',
            size: 'sm',
            icon: 'i-lucide-trash',
            label: 'Deletar',
            onClick: () => { if (authorId !== undefined) confirmDelete(authorId) }
          })
        )
      }

      return h('div', { class: 'flex space-x-2' }, buttons)
    }
  }
]
</script>

<template>
  <UPageBody>
      <UContainer>
          <UPageHeader title="Autores"  />
      </UContainer>
      <UContainer>
      <UCard>
        <template #header>
          <ULink href="/admin/author/create">
            <UButton>Criar Novo autor</UButton>
          </ULink>
        </template>
      </UCard>
      <UAlert v-if="isLoading" color="info" icon="i-lucide-loader-circle" :title="'Carregando...'" />
      <div v-else class="flex flex-col flex-1 w-full">
        <div class="flex px-4 py-3.5 border-b border-accented">
          <UInput v-model="globalFilter" class="max-w-sm" placeholder="Buscar..." />
        </div>

        <UTable ref="table" v-model:global-filter="globalFilter" :data="Authors" :columns="columns" />
      </div>

      <UModal v-model:open="isDeleteModalOpen">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Tem certeza?</h3>
            </template>
            <p>Você está prestes a deletar este autor. Esta ação não pode ser desfeita.</p>
            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton color="neutral" variant="ghost" @click="() => { isDeleteModalOpen = false }">Cancelar</UButton>
                <UButton color="error" :loading="isDeleting" @click="handleDelete">Confirmar</UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </UContainer>
  </UPageBody>
</template>