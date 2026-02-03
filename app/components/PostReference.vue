<script setup>
const props = defineProps({
    title: String,
})
</script>

<template>
    <UContainer class="w-full mb-8" style="padding: 0;">
        <p class="w-full">
            <UPageFeature as="h5" :title="title" class="p-3" />
        </p>
        <UTextarea color="neutral" variant="subtle" placeholder="Digite a referência aqui..." class="w-full" v-model="description" name="description"/>
    </UContainer>
</template>