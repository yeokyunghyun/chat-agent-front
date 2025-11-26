import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type AuthState } from '@/types'

export const initialState: AuthState = {
    loading: true,
    username: '',
    error: '',
}

interface LoginPayload {
  username: string
  password: string
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.loading = true
            state.error = undefined
        },
        loginSuccess: (state, { payload }: PayloadAction<string>) => {
            state.username = payload
            state.loading = false
        },
        loginError: (state, { payload }: PayloadAction<string>) => {
            state.error = payload
            state.loading = false
        },
    }
})

export const { login, loginSuccess, loginError } = authSlice.actions
export default authSlice.reducer