import jwt_decode from "jwt-decode";
import type { User } from "~/types/models";
const config = useRuntimeConfig()
const apiUrl = config.public.apiBaseUrl

type LoginOptions = {
    method: 'POST' | 'GET'
    headers: Record<string, string>
    body?: string
    credentials?: RequestCredentials
}

export const useAuth = () => {
    const token = useState<string | null>('token', () => null)

    const decodedTokenValue = async () => {
        if (!token.value) {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                token.value = storedToken;
            }
        }
        if (token.value) {
            return await jwt_decode(token.value);
        }

        return null
    }

    const user = useState<User | null>('user', () => null)

    const login = async (email: string, password: string) => {
        console.log(apiUrl,email, password, "WWW", `${apiUrl}/login`)
        if (!email || !password) return

        const options: LoginOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', accept: 'text/plain' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        };
        
        try{
            type LoginResponse = { 
                access_token: string
                token_type: string
                expires_in: number
            }
            const data = await $fetch<LoginResponse>(`${apiUrl}/login`, options)
            token.value = data.access_token
            localStorage.setItem('token', data.access_token)

            return data
        }
        catch(error){
            throw new Error('Login State failed', error as Error)
        }
    }
    
    const getUser = async () => {
        if (!token.value) {
            const storedToken = localStorage.getItem('token');
            
            if (!storedToken) {
                return;
            }
            
            token.value = storedToken;
        }
        
        const options = {
            method: 'GET' as const,
            headers: { Authorization: `Bearer ${token.value}` },
        };
        
        try{
            const data = await useFetch(`${apiUrl}/user`, options)
            
            // Assuming the API returns an array of users
            const value = data.data.value as { data: User[] } | undefined;
            const userData = value?.data as User[] | undefined;
            if (userData && userData[0]) {
                const firstName = userData[0].first_name;
                const lastName = userData[0].last_name;
                const user = `${firstName} ${lastName}`;
                return user;
            }
            return null;
        }
        catch(error){
            console.error(error)
            return null
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        navigateTo('/')
        return void 0
    }

    const refreshToken = async () => {
        const options = {
            method: 'POST' as const,
            credentials: 'include' as RequestCredentials,
        };
        
        try{
            type RefreshResponse = { 
                access_token: string
                token_type: string
                expires_in: number
            }
            await $fetch<RefreshResponse>(`${apiUrl}/auth/refresh`, options)
            
            return
        }
        catch(error){
            console.error(error)
            return
        }
    }

    return { login, token, getUser, logout, refreshToken, decodedTokenValue }
}