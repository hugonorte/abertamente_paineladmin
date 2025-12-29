<script setup lang="ts">
import type { FormError, FormSubmitEvent,
  EditorCustomHandlers, 
  EditorSuggestionMenuItem, 
  EditorMentionMenuItem, 
  EditorEmojiMenuItem, 
  DropdownMenuItem
 } from '@nuxt/ui'


definePageMeta({
  layout: 'admin',
})

const state = reactive({
  title: undefined,
  tldr: undefined,
  content: undefined,
  categories: [] as { label: string; value: string }[],
  imagePath: undefined,
  author: undefined,
})

type Schema = typeof state

function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.title) errors.push({ name: 'title', message: 'O título do post é um campo obrigatório' })
  if (!state.tldr) errors.push({ name: 'tldr', message: 'O resumo do post é um campo obrigatório' })
  if (!state.content) errors.push({ name: 'content', message: 'O conteúdo do post é um campo obrigatório' })
  if (!state.categories || state.categories.length === 0) errors.push({ name: 'categories', message: 'Pelo menos uma categoria deve ser selecionada' })
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

// Example categories for the input menu ## Alterar para buscar do backend
const categoryOptions = [
  { label: 'Tecnologia', value: 'tecnologia' },
  { label: 'Educação', value: 'educacao' },
  { label: 'Saúde', value: 'saude' },
  { label: 'Negócios', value: 'negocios' }
]

const authorOptions = [
  { label: 'Autor 1', value: 'autor_1' },
  { label: 'Autor 2', value: 'autor_2' },
  { label: 'Autor 3', value: 'autor_3' }
]

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}

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
          
          <UFormField label="Conteúdo completo do post" name="content" class="mb-5">
            <UEditor v-slot="{ editor }" v-model="state.content" content-type="markdown" class="min-h-[300px] border border-gray-300 rounded">
              <UEditorToolbar :editor="editor" :items="items" />
            </UEditor>
          </UFormField>
          
          <UFormField label="Categorias" name="categories" class="mb-5">
            <UInputMenu v-model="state.categories" multiple :items="categoryOptions" class="w-full"/>
          </UFormField>

          <template #footer>
            <UButton type="submit" color="primary">Salvar Post</UButton>
          </template>
        </UCard>
      </UContainer>
    </UForm>
  </UPageBody>
</template>
