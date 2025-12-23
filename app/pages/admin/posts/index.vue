<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <UPageBody>
    <UContainer>
        <UPageHeader title="Posts"  />
    </UContainer>
    <UContainer>
    <UCard>
    <template #header>
      Teste
    </template>

    body

    <template #footer>
      <UButton>Criar Novo post</UButton>
    </template>
  </UCard>
  </UContainer>
    
  </UPageBody>
</template>

