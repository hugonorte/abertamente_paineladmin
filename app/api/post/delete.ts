const config = useRuntimeConfig()
const apiUrl = config.public.apiBaseUrl;

export async function deletePost(id: number) : Promise<void> {
    const auth = useAuth()
    const token = auth.token.value
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'O usuário não está autenticado',
        })
    }

    try {
        const options = {
            method: 'DELETE' as const,
            headers: {
                'Accept': 'application/json'
            } as Record<string, string>,
        };

        if (token) {
            options.headers.Authorization = `Bearer ${token}`;
        }

        await $fetch(`${apiUrl}/post/${id}`, options)
    }
    catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erro ao deletar post',
        })
    }
}
