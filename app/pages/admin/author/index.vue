<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

import { ref, onMounted } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Author } from '~/types/models'
import { fetchAuthors } from '~/api/author/get'

const Authors = ref<Author[]>([])
const isLoading = ref<boolean>(false)
const globalFilter = ref('')

onMounted(async () => {
  isLoading.value = true
  try {
    Authors.value = await fetchAuthors()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
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
    </UContainer>
  </UPageBody>
</template>