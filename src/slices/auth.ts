import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type AuthState } from '@/types'

export const initialState: AuthState = {
    username: '',
    loading: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.loading = true
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