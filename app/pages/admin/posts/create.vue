<script setup lang="ts">
import type { FormError, FormSubmitEvent,
  EditorCustomHandlers, 
  EditorSuggestionMenuItem, 
  EditorMentionMenuItem, 
  EditorEmojiMenuItem, 
  DropdownMenuItem
 } from '@nuxt/ui'
import PostReference from '~/components/PostReference.vue';
import type { BibliographicReference, Footnote } from '~/types/models';
import { fetchAuthors } from '~/api/author/get'
import { fetchCategories } from '~/api/category/get'
import type { Author } from '~/types/models'
import type { Category } from '~/types/models'
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
})

const isLoading = ref<boolean>(false)
const Authors = ref<Author[]>([])
const Categories = ref<Category[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    Authors.value = await fetchAuthors()
    Categories.value = await fetchCategories()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

const state = reactive({
  title: undefined,
  tldr: undefined,
  content: undefined,
  categories: undefined,
  imagePath: undefined,
  author: undefined,
})

type Schema = typeof state

function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.title) errors.push({ name: 'title', message: 'O título do post é um campo obrigatório' })
  if (!state.tldr) errors.push({ name: 'tldr', message: 'O resumo do post é um campo obrigatório' })
  if (!state.content) errors.push({ name: 'content', message: 'O conteúdo do post é um campo obrigatório' })
  if (!state.categories || state.categories === undefined) errors.push({ name: 'categories', message: 'Pelo menos uma categoria deve ser selecionada' })
  if (!state.imagePath) errors.push({ name: 'imagePath', message: 'A imagem do post é um campo obrigatório' })
  if (!state.author) errors.push({ name: 'author', message: 'O autor do post é um campo obrigatório' })
  return errors
}

type EditorToolbarItem =
  | { kind: 'mark'; mark: string; icon: string }
  | { kind: 'heading'; level: number; icon: string }
  | { kind: 'textAlign'; align: string; icon: string }
  | { kind: 'bulletList'; icon: string }
  | { kind: 'orderedList'; icon: string }
  | { kind: 'blockquote'; icon: string }
  | { kind: 'link'; icon: string }

const items: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'heading', level: 1, icon: 'i-lucide-heading-1' },
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
  { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left' },
  { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center' },
  { kind: 'bulletList', icon: 'i-lucide-list' },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote', icon: 'i-lucide-quote' },
  { kind: 'link', icon: 'i-lucide-link' }
]

// Example authors for the input menu ## Alterar para buscar do backend
const authorOptions = computed(() => 
  Authors.value.map((author) => ({ label: author.name, value: author.id }))
)

// Example categories for the input menu ## Alterar para buscar do backend
const categoryOptions = computed(() => 
  Categories.value.map((category) => ({ label: category.name, value: category.id }))
)


const toast = useToast()

const bibliographicReferences = reactive<BibliographicReference[]>([])
const footnotes = reactive<Footnote[]>([])

const addReference = () => {
  bibliographicReferences.push(
    { 
      id: bibliographicReferences.length + 1, 
      content: "" 
    }
  )
  console.log(bibliographicReferences)
}

const addFootnote = () => {
  footnotes.push(
    { 
      id: footnotes.length + 1, 
      content: "" 
    }
  )
  console.log(footnotes)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
 console.log(bibliographicReferences.length)
</script>

<template>
  <UPageBody class="w-full" >
    <UContainer >
      <UPageHeader title="Criar Post"  />
    </UContainer>
    <UForm :validate="validate" :state="state" class="generic_form"   @submit="onSubmit" >
      <UContainer >
        <UCard>
          <template #header>
            <h2 class="text-lg font-medium">Novo Post</h2>
          </template>

          <UFormField label="Título" name="title" class="mb-5">
            <UInput v-model="state.title" variant="subtle"  placeholder="Digite o título do post" class="w-full" />
          </UFormField>
          
          <UFormField label="Autor" name="author" class="mb-5">
            <USelect v-model="state.author" :items="authorOptions" class="w-full" />
          </UFormField>

          <UFormField label="Resuma o contéúdo do post em poucas palavras" name="tldr" class="mb-5">
            <UTextarea v-model="state.tldr" color="neutral" variant="subtle" placeholder="Resumo..." class="w-full"/>
          </UFormField>
          
          <UFormField label="Resuma o contéúdo do post em poucas palavras" name="imagePath" class="mb-5">
            <UFileUpload 
              v-model="state.imagePath" 
              accept="image/*" 
              label="Arraste uma imagem ou clique para selecionar" 
              class="w-full min-h-48"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              color="primary" 
              highlight />
          </UFormField>
          
          <RichTextEditor v-model="state.content" />
          
          <UFormField label="Categorias" name="categories" class="mb-5">
            <USelect v-model="state.categories" :items="categoryOptions" class="w-full" />
          </UFormField>

           <UPageFeature as="h2" title="Referências Bibliográficas" class="bg-accented p-3 mb-8" />
           <UContainer v-if="bibliographicReferences.length < 1" class="flex items-center justify-center w-full mb-8">
            Nenhuma referência adicionada
           </UContainer>
           <div v-else class="m-0">
            <UContainer v-for="(referencia, index) in bibliographicReferences" :key="index">
              <PostReference :title="`Referência ${index + 1}`" />
            </UContainer>
           </div>
           <UContainer class="flex items-center justify-center w-full mb-8">
             <UButton icon="i-lucide-square-plus" size="md" color="primary" @click="addReference">Adicionar Nova Referência</UButton>
           </UContainer>


           <UPageFeature as="h2" title="Notas de Rodapé" class="bg-accented p-3 mb-8" />
           <UContainer v-if="footnotes.length < 1" class="flex items-center justify-center w-full mb-8">
            Nenhuma nota de rodapé adicionada
           </UContainer>
           <div v-else class="m-0">
            <UContainer v-for="(nota, index) in footnotes" :key="index">
              <PostFootnote :title="`Nota de Rodapé ${index + 1}`" />
            </UContainer>
           </div>
           <UContainer class="flex items-center justify-center w-full mb-8">
             <UButton icon="i-lucide-square-plus" size="md" color="primary" @click="addFootnote">Adicionar Nova Nota de Rodapé</UButton>
           </UContainer>

           <template #footer>
            <UButton icon="i-lucide-save" size="md" type="submit" color="warning">Salvar Post</UButton>
          </template>
        </UCard>
      </UContainer>
    </UForm>
  </UPageBody>
</template>

