<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, useField } from 'vee-validate'

const schema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
})
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: emailField, errorMessage: emailError } = useField<string>('email')
const { value: passwordField, errorMessage: passwordError } = useField<string>('password')
const auth = useAuth()

const onSubmit = handleSubmit(
  async (values) => {
    try {
      await auth.login(values.email, values.password)
      navigateTo('/admin/dashboard')
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error)
      console.error('Login page failed:', error)
      throw new Error(`Login page failed: ${errMsg}`)
    }
  },
  (validationErrors) => {
    console.error('❌ Erros de validação:', validationErrors.errors)
  },
)
</script>

<template>
    <div class="login_container">
        <form @submit.prevent="onSubmit">
            <fieldset>
                <div>
            <label>Email</label>
            <input v-model="emailField" type="email" required >
            <span v-if="emailError" class="error_message">{{ emailError }}</span>
          </div>

          <div>
            <label>Senha</label>
            <input v-model="passwordField" type="password" required >
            <span v-if="passwordError" class="error_message">{{ passwordError }}</span>
          </div>
            </fieldset>
            <button type="submit">Enviar</button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
div {
  font-family: Roboto, sans-serif;
}
.login_container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #eef2f7;
}
form {
    width: 400px;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    
    fieldset {
        border: none;
        padding: 0;
        margin-bottom: 15px;
    
        div {
        margin-bottom: 10px;
    
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
    
        input {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    
        .error_message {
            color: red;
            font-size: 0.875em;
            margin-top: 5px;
            display: block;
        }
        }
    }
    
    button {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    
        &:hover {
        background-color: #0056b3;
        }
    }
}
</style>