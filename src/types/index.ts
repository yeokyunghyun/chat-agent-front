export interface AuthState {
    loading: boolean,
    username: string,
    error?: string,
}

export interface RootState {
  authState: AuthState
}