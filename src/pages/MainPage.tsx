import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import CustListBar from "@/components/chat/CustListBar"
import MessageList from '@/components/chat/MessageList'
import CustDetailBar from '@/components/chat/CustDetailBar'

import {
  type Message,
  type ConsultationRequest,
  type ConsultationHistory,
} from "@/types/chat";

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<"history" | "info">("history");

  const clientRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 웹소켓 연결 + 초기 데이터
  useEffect(() => {
    const socket = new SockJS("http://localhost:8443/ws");
    const client = Stomp.over(socket);
    clientRef.current = client;

    client.connect({}, () => {
      client.subscribe("/topic/agent/requests", (msg) => {
        const req: ConsultationRequest = JSON.parse(msg.body);
        setConsultationRequests((prev) => [req, ...prev]);
      });

      client.subscribe("/topic/agent", (msg) => {
        if (selectedRequest) {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        }
      });
    });

    // 더미 데이터
    setConsultationRequests([
      {
        id: "1",
        customerId: "customer1",
        customerName: "홍길동",
        requestTime: new Date().toLocaleString(),
        status: "pending",
      },
    ]);

    setConsultationHistory([
      {
        id: "hist1",
        customerId: "customer3",
        customerName: "이영희",
        startTime: new Date(Date.now() - 86400000).toLocaleString(),
        endTime: new Date(Date.now() - 86000000).toLocaleString(),
        messages: [
          { userId: "customer3", content: "안녕하세요" },
          { userId: "agent", content: "네, 안녕하세요" },
        ],
      },
    ]);

    return () => {
      if (clientRef.current?.connected) clientRef.current.disconnect();
    };
  }, []);

  // 상담 요청 클릭
  const handleRequestClick = (req: ConsultationRequest) => {
    setSelectedRequest(req);
    setMessages([]);
  };

  // 메시지 전송
  const sendMessage = () => {
    if (!selectedRequest || !inputMessage.trim()) return;

    const msg: Message = {
      userId: "agent",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    clientRef.current.send(
      `/app/chat/${selectedRequest.customerId}`,
      {},
      JSON.stringify(msg)
    );

    setMessages((prev) => [...prev, msg]);
    setInputMessage("");
  };

  // 상담 종료
  const endConsultation = () => {
    if (!selectedRequest) return;

    setConsultationHistory((prev) => [
      ...prev,
      {
        id: `hist_${Date.now()}`,
        customerId: selectedRequest.customerId,
        customerName: selectedRequest.customerName,
        startTime: selectedRequest.requestTime,
        endTime: new Date().toLocaleString(),
        messages,
      },
    ]);

    setSelectedRequest(null);
    setMessages([]);
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      
      <CustListBar
        consultationRequests={consultationRequests}
        consultationHistory={consultationHistory}
        selectedRequest={selectedRequest}
        onClickRequest={handleRequestClick}
      />

      <MessageList
        selectedRequest={selectedRequest}
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        endConsultation={endConsultation}
        messagesEndRef={messagesEndRef}
      />

      <CustDetailBar
        selectedRequest={selectedRequest}
        consultationHistory={consultationHistory}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
