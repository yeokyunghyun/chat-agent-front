import type { RootState } from "@/slices"; // 현재 네가 만든 구조에 맞게 import

export const selectMessages = (state: RootState) => state.chat.messages;
export const selectSelectedRequest = (state: RootState) => state.chat.selectedRequest;
export const selectConsultationRequests = (state: RootState) => state.chat.consultationRequests;
export const selectConsultationHistory = (state: RootState) => state.chat.consultationHistory;
export const selectActiveTab = (state: RootState) => state.chat.activeTab;
