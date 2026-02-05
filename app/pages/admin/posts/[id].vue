<script setup lang="ts">
import type {
  FormError, FormSubmitEvent,
  EditorCustomHandlers,
  EditorSuggestionMenuItem,
  EditorMentionMenuItem,
  EditorEmojiMenuItem,
  EditorToolbarItem,
  DropdownMenuItem
} from '@nuxt/ui'
import type { Post } from '~/types/models';
import PostReference from '~/components/PostReference.vue';
import type { BibliographicReference, Footnote } from '~/types/models';
import { fetchAuthors } from '~/api/author/get'
import { fetchCategories } from '~/api/category/get'
import { fetchPostById } from '~/api/post/get'
import type { Author } from '~/types/models'
import type { Category } from '~/types/models'
import { createPost, updatePost } from '~/api/post/post'
import { ref, computed, reactive, onMounted } from 'vue' // Ensuring imports are consolidated if needed, or rely on Nuxt auto-imports but keeping structure
import type { Editor } from '@tiptap/vue-3'
import ImageUpload from './EditorImageUploadExtension'
import { fetchBibliographicReferenceByPostId } from '~/api/bibliographicReference/get';
import { fetchFootnoteByPostId } from '~/api/footnote/get';

const postId = useRoute().params.id
const config = useRuntimeConfig()

// Define extensions and handlers OUTSIDE the component scope.
const editorExtensions = [ImageUpload]

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
  ssr: false, // Ensure this page is client-side only
})

const isLoading = ref<boolean>(false)
const Authors = ref<Author[]>([])
const Categories = ref<Category[]>([])
const Post = ref<Post>({})
const toast = useToast()
const BibliographicReferences = ref<BibliographicReference[]>([])
const Footnotes = ref<Footnote[]>([])
const currentImage = ref<string | null>(null)

// Computed property to display image URL
const currentImageUrl = computed(() => {
    if (!currentImage.value) return null
    if (currentImage.value.startsWith('http')) return currentImage.value
    return `${config.public.publicImagesFolder}/${currentImage.value}`
})

onMounted(async () => {
  console.log('Component mounted, starting fetch...')
  isLoading.value = true
  try {
    const post = await fetchPostById(postId as string)
    Post.value = post

    state.title = post.title || ''
    state.tldr = post.tldr || ''
    state.content = post.content || ''
    state.author = post.author_id
    state.categories = post.category_id 
    
    // Check if image_path exists and assign to currentImage NOT state.imagePath
    if (post.image_path) {
        currentImage.value = post.image_path
    }

    Authors.value = await fetchAuthors()
    Categories.value = await fetchCategories()
    BibliographicReferences.value = await fetchBibliographicReferenceByPostId(Post.value.id as number)
    Footnotes.value = await fetchFootnoteByPostId(Post.value.id as number)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

const state = reactive({
  title: '',
  tldr: '',
  content: '',
  categories: undefined as number | undefined,
  imagePath: undefined as any, // Should remain undefined or be a File/FileList
  author: undefined as number | undefined,
})

type Schema = typeof state

function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.title) errors.push({ name: 'title', message: 'O título do post é um campo obrigatório' })
  if (!state.tldr) errors.push({ name: 'tldr', message: 'O resumo do post é um campo obrigatório' })
  if (!state.content) errors.push({ name: 'content', message: 'O conteúdo do post é um campo obrigatório' })
  if (!state.categories || state.categories === undefined) errors.push({ name: 'categories', message: 'Pelo menos uma categoria deve ser selecionada' })
  
  // Validate image: required only if no current image exists AND no new image is uploaded
  if (!state.imagePath && !currentImage.value) {
    errors.push({ name: 'imagePath', message: 'A imagem do post é um campo obrigatório' })
  }
  
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


const addReference = () => {
  BibliographicReferences.value.push(
    {
      id: BibliographicReferences.value.length + 1,
      description: ""
    }
  )
}

const addFootnote = () => {
  Footnotes.value.push(
    {
      id: Footnotes.value.length + 1,
      description: ""
    }
  )
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const formData = new FormData()
  // Add _method PUT for Laravel to handle Update with FormData
  formData.append('_method', 'PUT') 

  if (event.data.title) formData.append('title', event.data.title)
  if (event.data.tldr) formData.append('tldr', event.data.tldr)
  if (event.data.content) formData.append('content', event.data.content)
  if (event.data.categories) {
    formData.append('category_id', String(event.data.categories))
  }
  // Only append image if a NEW one is uploaded
  if (event.data.imagePath) {
    const file = Array.isArray(event.data.imagePath) ? event.data.imagePath[0] : event.data.imagePath
    // formData.append('image_path', file) // Ensure backend expects 'image_path'
    formData.append('image_path', file)
  }
  if (event.data.author) formData.append('author_id', String(event.data.author))
  
  // Note: Status handling - typically updates might carry status or validation. 
  // Assuming we keep it as it was or it is handled by backend state logic. 
  // If explicitly 'draft' every time:
  formData.append('status', 'draft')

  try {
    // Use updatePost with the correct ID
    const post = await updatePost(Number(postId), formData)

    toast.add({ title: 'Success', description: 'Post atualizado com sucesso.', color: 'success' })
  }
  catch (error) {
    console.error(error)
    toast.add({ title: 'Error', description: 'Erro ao atualizar post.', color: 'error' })
  }
}
</script>
      
<template>
<UPageBody class="w-full" >
  <UContainer >
    <UPageHeader title="Editar Post"  />
  </UContainer>
  <UForm :validate="validate" :state="state" class="generic_form"   @submit="onSubmit" >
    <UContainer >
      <UCard>
        <template #header>
          <h2 class="text-lg font-medium">Editar Post</h2>
        </template>

        <UFormField label="Título" name="title" class="mb-5" :ui="{ label: 'custom-label' }">
          <UInput v-model="state.title" variant="subtle"  placeholder="Digite o título do post" class="w-full" />
        </UFormField>
        
        <UFormField label="Autor" name="author" class="mb-5" :ui="{ label: 'custom-label' }">
          <USelect v-model="state.author" :items="authorOptions" class="w-full" />
        </UFormField>

        <UFormField label="Resuma o contéúdo do post em poucas palavras" name="tldr" class="mb-5" :ui="{ label: 'custom-label' }">
          <UTextarea v-model="state.tldr" color="neutral" variant="subtle" placeholder="Resumo..." class="w-full"/>
        </UFormField>
        
        <UFormField label="Imagem de capa" name="imagePath" class="mb-5" :ui="{ label: 'custom-label' }">
          <!-- Show existing image if available -->
            <div v-if="currentImageUrl" class="mb-4 current-image">
              <p class="text-sm text-gray-500 mb-2">Imagem atual:</p>
              <img :src="currentImageUrl" alt="Capa atual" class="w-48 h-auto rounded-md shadow-sm" />
            </div>

          <UFileUpload 
            v-model="state.imagePath" 
            accept="image/*" 
            label="Arraste uma nova imagem ou clique para selecionar (substituir)" 
            class="w-full min-h-48"
            description="SVG, PNG, JPG or GIF (max. 2MB)"
            color="primary" 
            highlight />
        </UFormField>

        <h3 class="custom-label">Conteúdo</h3>
        <div v-if="!isLoading">
          <UEditor
          key="post-content-editor"
          v-slot="{ editor }"
          v-model="state.content"
          :extensions="editorExtensions"
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
        </div>
        
        <UFormField label="Categorias" name="categories" class="mb-5" :ui="{ label: 'custom-label' }">
          <USelect v-model="state.categories" :items="categoryOptions" class="w-full" />
        </UFormField>

        <UPageFeature as="h2" title="Referências Bibliográficas" class="bg-accented p-3 mb-8" />
        <UContainer v-if="BibliographicReferences.length < 1" class="flex items-center justify-center w-full mb-8">
          Nenhuma referência adicionada
        </UContainer>
        <div v-else class="m-0">
          <UContainer v-for="(referencia, index) in BibliographicReferences" :key="referencia.id">
            <PostReference :title="`Referência ${index + 1}`" v-model:description="referencia.description" />
          </UContainer>
        </div>
        <UContainer class="flex items-center justify-center w-full mb-8">
          <UButton icon="i-lucide-square-plus" size="md" color="primary" @click="addReference">Adicionar Nova Referência</UButton>
        </UContainer>


        <UPageFeature as="h2" title="Notas de Rodapé" class="bg-accented p-3 mb-8" />
        <UContainer v-if="Footnotes.length < 1" class="flex items-center justify-center w-full mb-8">
          Nenhuma nota de rodapé adicionada
        </UContainer>
        <div v-else class="m-0">
          <UContainer v-for="(nota, index) in Footnotes" :key="nota.id">
            <PostReference :title="`Nota de Rodapé ${index + 1}`" v-model:description="nota.description" />
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

<style scoped>
.current-image img {
  width: 100%;
}
</style>


