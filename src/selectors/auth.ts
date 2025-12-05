import type { RootState } from "@/slices/index";

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthUsername = (state: RootState) => state.auth.username;
export const selectAuthError = (state: RootState) => state.auth.error;