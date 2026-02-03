<script setup lang="ts">
import type { FormError, FormSubmitEvent,
  EditorCustomHandlers, 
  EditorSuggestionMenuItem, 
  EditorMentionMenuItem, 
  EditorEmojiMenuItem, 
  EditorToolbarItem,
  DropdownMenuItem
 } from '@nuxt/ui'
import PostReference from '~/components/PostReference.vue';
import type { BibliographicReference, Footnote } from '~/types/models';
import { fetchAuthors } from '~/api/author/get'
import { fetchCategories } from '~/api/category/get'
import type { Author } from '~/types/models'
import type { Category } from '~/types/models'
import { createPost } from '~/api/post/post'
import { ref, computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import ImageUpload from './EditorImageUploadExtension'
import { createBibliographicReferences } from '~/api/bibliographicReference/post';
import { createFootnote } from '~/api/footnote/post';


const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

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

type EditorToolbarItemType =
  EditorToolbarItem<typeof customHandlers>[]

const items: EditorToolbarItemType[] = [
  [
    {
      kind: 'imageUpload',
      icon: 'i-lucide-image',
      label: 'Add image',
      variant: 'soft'
    }
  ],
  [
    {
      icon: 'i-lucide-heading',
      content: {
        align: 'start'
      },
      items: [
        {
          kind: 'heading',
          level: 1,
          icon: 'i-lucide-heading-1',
          label: 'Heading 1'
        },
        {
          kind: 'heading',
          level: 2,
          icon: 'i-lucide-heading-2',
          label: 'Heading 2'
        },
        {
          kind: 'heading',
          level: 3,
          icon: 'i-lucide-heading-3',
          label: 'Heading 3'
        },
        {
          kind: 'heading',
          level: 4,
          icon: 'i-lucide-heading-4',
          label: 'Heading 4'
        }
      ]
    }
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: 'i-lucide-bold'
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide-italic'
    },
    {
      kind: 'mark',
      mark: 'underline',
      icon: 'i-lucide-underline'
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: 'i-lucide-strikethrough'
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: 'i-lucide-code'
    },
    { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left' },
    { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center' },
    { kind: 'bulletList', icon: 'i-lucide-list' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
    { kind: 'blockquote', icon: 'i-lucide-quote' },
    { kind: 'link', icon: 'i-lucide-link' },
  ]
] satisfies EditorToolbarItem<typeof customHandlers>[][]

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
      description: "" 
    }
  )
}

const addFootnote = () => {
  footnotes.push(
    { 
      id: footnotes.length + 1, 
      description: "" 
    }
  )
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const formData = new FormData()
  if (event.data.title) formData.append('title', event.data.title)
  if (event.data.tldr) formData.append('tldr', event.data.tldr)
  if (event.data.content) formData.append('content', event.data.content)
  if (event.data.categories) formData.append('category_id', event.data.categories)
  if (event.data.imagePath) {
    const file = Array.isArray(event.data.imagePath) ? event.data.imagePath[0] : event.data.imagePath
    formData.append('image_path', file)
  }
  if (event.data.author) formData.append('author_id', event.data.author)
  formData.append('status', 'draft')
  
  try{
    const post = await createPost(formData)
    bibliographicReferences.forEach(async (reference) => {
      await createBibliographicReferences({
        post_id: post.id,
        description: reference.description
      })
    })
    footnotes.forEach(async (footnote) => {
      await createFootnote({
        post_id: post.id,
        description: footnote.description
      })
    })
    toast.add({ title: 'Success', description: 'Post criado com sucesso.', color: 'success' })
  }
  catch (error) {
    toast.add({ title: 'Error', description: 'Erro ao criar post.', color: 'error' })
  }
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
          
          <UFormField label="Imagem de capa" name="imagePath" class="mb-5">
            <UFileUpload 
              v-model="state.imagePath" 
              accept="image/*" 
              label="Arraste uma imagem ou clique para selecionar" 
              class="w-full min-h-48"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              color="primary" 
              highlight />
          </UFormField>


          <h3>Conteúdo</h3>
          <UEditor
            v-slot="{ editor }"
            v-model="state.content"
            :extensions="[ImageUpload]"
            :handlers="customHandlers"
            content-type="html"
            :ui="{ base: 'p-8 sm:px-16' }"
            class="w-full min-h-74"
            placeholder="Escreva aqui..."
            
          >
            <UEditorToolbar
              :editor="editor"
              :items="items"
              class="border-b border-muted py-2 px-8 sm:px-16 overflow-x-auto"
            />
          </UEditor>
          
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

