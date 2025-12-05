import { type RootState } from '@/slices/index'

export const getAuth = (state: RootState) => state.auth;
export const getChat = (state: RootState) => state.chat;