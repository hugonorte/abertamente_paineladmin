<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Category } from '~/types/models'
import { fetchCategories } from '~/api/category/get'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const Categories = ref<Category[]>([])
const isLoading = ref<boolean>(false)
const globalFilter = ref('')

onMounted(async () => {
  isLoading.value = true
  try {
    Categories.value = await fetchCategories()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

const columns: TableColumn<Category>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'Nome'
  }
]
</script>

<template>
  <UPageBody>
      <UContainer>
          <UPageHeader title="Categorias"  />
      </UContainer>
      <UContainer>
      <UCard>
        <template #header>
          <ULink href="/admin/category/create">
            <UButton>Criar Nova Categoria</UButton>
          </ULink>
        </template>
      </UCard>
      <UAlert v-if="isLoading" color="info" icon="i-lucide-loader-circle" :title="'Carregando...'" />
      <div v-else class="flex flex-col flex-1 w-full">
        <div class="flex px-4 py-3.5 border-b border-accented">
          <UInput v-model="globalFilter" class="max-w-sm" placeholder="Buscar..." />
        </div>

        <UTable ref="table" v-model:global-filter="globalFilter" :data="Categories" :columns="columns" />
      </div>
    </UContainer>
  </UPageBody>
</template>