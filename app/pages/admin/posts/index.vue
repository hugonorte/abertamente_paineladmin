<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

import { ref, onMounted, h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Post } from '~/types/models'
import { fetchPostsSummary } from '~/api/post/get'

const posts = ref<Post[]>([])
const isLoading = ref<boolean>(false)
const globalFilter = ref('')

onMounted(async () => {
  isLoading.value = true
  try {
    posts.value = await fetchPostsSummary()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

const columns: TableColumn<Post>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id') }`
  },
  {
    accessorKey: 'title',
    header: 'Título'
  },
  {
    accessorKey: 'author_name',
    header: 'Autor',
  },
  {
    accessorKey: 'category_name',
    header: 'Categoria'
  },
  {
    accessorKey: 'created_at',
    header: 'Criado em',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleDateString('pt-BR')
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      switch (status) {
        case 'published':
          return h(resolveComponent('UBadge'), { color: 'success', variant: 'subtle', label: 'Publicado' })
        case 'draft':
          return h(resolveComponent('UBadge'), { color: 'warning', variant: 'subtle', label: 'Rascunho' })
        case 'archived':
          return h(resolveComponent('UBadge'), { color: 'error', variant: 'subtle', label: 'Arquivado' })
        default:
          break;
      }
    }
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const postId = row.original.id
      return h(resolveComponent('UButton'), { 
            color: 'primary', 
            size: 'sm', 
            icon:"i-lucide-pencil",
            to: `/admin/posts/${postId}` ,
            label:"Editar"
      })
    }
  }
]
</script>

<template>
  <UPageBody>
      <UContainer>
          <UPageHeader title="Posts"  />
      </UContainer>
      <UContainer>
      <UCard>
        <template #header>
          <ULink href="/admin/posts/create">
            <UButton>Criar Novo post</UButton>
          </ULink>
        </template>
      </UCard>
      <UAlert v-if="isLoading" color="info" icon="i-lucide-loader-circle" :title="'Carregando...'" />
      <div v-else class="flex flex-col flex-1 w-full">
        <div class="flex px-4 py-3.5 border-b border-accented">
          <UInput v-model="globalFilter" class="max-w-sm" placeholder="Buscar..." />
        </div>

        <UTable ref="table" v-model:global-filter="globalFilter" :data="posts" :columns="columns" />
      </div>
    </UContainer>
  </UPageBody>
</template>

