import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type ChatState,
  type Message,
  type ConsultationRequest,
  type ConsultationHistory
} from "@/types/chat";

const initialState: ChatState = {
  messages: [],
  selectedRequest: null,
  consultationRequests: [],
  consultationHistory: [],
  activeTab: "history",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // 상담 요청 선택
    setSelectedRequest(state, action: PayloadAction<ConsultationRequest | null>) {
      state.selectedRequest = action.payload;
      state.messages = []; // 선택 시 메시지 초기화 (AgentPage 로직과 동일)
    },

    // 메시지 추가
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },

    // 상담 요청 전체 세팅
    setConsultationRequests(state, action: PayloadAction<ConsultationRequest[]>) {
      state.consultationRequests = action.payload;
    },

    // 상담 내역 전체 세팅
    setConsultationHistory(state, action: PayloadAction<ConsultationHistory[]>) {
      state.consultationHistory = action.payload;
    },

    // 탭 상태 변경
    setActiveTab(state, action: PayloadAction<"history" | "info">) {
      state.activeTab = action.payload;
    },
  }
});

export const {
  setSelectedRequest,
  addMessage,
  setConsultationRequests,
  setConsultationHistory,
  setActiveTab
} = chatSlice.actions;

export default chatSlice.reducer;
