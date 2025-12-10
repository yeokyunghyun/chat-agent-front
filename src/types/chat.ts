export interface ChatState {
  messages: Message[];
  selectedRequest: ConsultationRequest | null;
  consultationRequests: ConsultationRequest[];
}

export interface Message {
  userId: string;
  customerId: string;
  content: string;
  timestamp?: string;
}

export interface ConsultationRequest {
  id: string;
  customerId: string;
  customerName: string;
  requestTime: string;
  status: "pending" | "in_progress" | "post_process" | "closed";
}
