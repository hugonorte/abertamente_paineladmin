<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchPostsSummary } from '~/api/post/get'
import type { Post } from '~/types/models'

// Import chart components
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

const posts = ref<Post[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    posts.value = await fetchPostsSummary()
  } catch(e) {
    console.error('Erro ao buscar resumo de posts', e)
  } finally {
    isLoading.value = false
  }
})

const publishedCount = computed(() => posts.value.filter(p => p.status === 'published').length)
const draftCount = computed(() => posts.value.filter(p => p.status === 'draft').length)

const chartData = computed(() => {
  const authorData: Record<string, { published: number, draft: number }> = {}
  
  posts.value.forEach(p => {
    const author = p.author_name || 'Desconhecido'
    if (!authorData[author]) {
      authorData[author] = { published: 0, draft: 0 }
    }
    
    if (p.status === 'published') {
      authorData[author].published += 1
    } else if (p.status === 'draft') {
      authorData[author].draft += 1
    }
  })
  
  const labels = Object.keys(authorData)
  const publishedCounts = labels.map(label => authorData[label].published)
  const draftCounts = labels.map(label => authorData[label].draft)
  
  return {
    labels,
    datasets: [
      {
        label: 'Publicados',
        backgroundColor: '#10b981', // Tailwind success (emerald-500)
        borderRadius: 4,
        data: publishedCounts
      },
      {
        label: 'Rascunhos',
        backgroundColor: '#f59e0b', // Tailwind warning (amber-500)
        borderRadius: 4,
        data: draftCounts
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y', // Exibe o gráfico na horizontal
  plugins: {
    legend: {
      display: true
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold' as const
      },
      formatter: Math.round,
      display: function(context: any) {
        return context.dataset.data[context.dataIndex] > 0; // Exibe só se for maior que 0
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}
</script>

<template>
  <div class="mt-8">
    <UAlert v-if="isLoading" color="info" icon="i-lucide-loader-circle" title="Carregando estatísticas..." />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Card: Publicados -->
      <UCard class="flex flex-col items-center justify-center text-center">
        <UIcon name="i-lucide-check-circle-2" class="size-12 text-success mb-2" />
        <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300">Posts Publicados</h3>
        <p class="text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ publishedCount }}</p>
      </UCard>
      
      <!-- Card: Rascunhos -->
      <UCard class="flex flex-col items-center justify-center text-center">
        <UIcon name="i-lucide-file-edit" class="size-12 text-warning mb-2" />
        <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300">Posts em Rascunho</h3>
        <p class="text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ draftCount }}</p>
      </UCard>
      
      <!-- Card: Gráfico (Ocupa 2 colunas no desktop) -->
      <UCard class="md:col-span-2">
        <template #header>
          <h3 class="text-lg font-medium">Posts por Autor</h3>
        </template>
        <div class="h-64">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </UCard>

    </div>
  </div>
</template>
