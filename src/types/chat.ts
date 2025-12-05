export interface ChatState {
  messages: Message[];
  selectedRequest: ConsultationRequest | null;
  consultationRequests: ConsultationRequest[];
  consultationHistory: ConsultationHistory[];
  activeTab: "history" | "info";
}

export interface Message {
  userId: string;
  content: string;
  timestamp?: string;
}

export interface ConsultationRequest {
  id: string;
  customerId: string;
  customerName: string;
  requestTime: string;
  status: "pending" | "active" | "completed";
}

export interface ConsultationHistory {
  id: string;
  customerId: string;
  customerName: string;
  startTime: string;
  endTime: string;
  messages: Message[];
}
