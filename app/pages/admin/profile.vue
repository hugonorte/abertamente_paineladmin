<template>
  <div>
    <UDashboardPage>
      <UDashboardPanel grow>
        <UDashboardNavbar title="Perfil do Usuário" />
        <UDashboardPanelContent>
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Meus Dados</h3>
            </template>
            <div v-if="user" class="space-y-4">
              <div>
                <span class="font-medium">Nome:</span> {{ user.full_name || `${user.first_name} ${user.last_name}` }}
              </div>
              <div>
                <span class="font-medium">Email:</span> {{ user.email || 'Não disponível' }}
              </div>
              <div>
                <span class="font-medium">Papel (Role):</span> <UBadge color="primary">{{ user.role_label || user.role }}</UBadge>
              </div>
            </div>
          </UCard>
        </UDashboardPanelContent>
      </UDashboardPanel>
    </UDashboardPage>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/models'

const auth = useAuth()
const user = useState<User | null>('user')

onMounted(async () => {
  if (!user.value) {
    await auth.getUser()
  }
})
</script>
