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
import HeaderBar from "@/components/common/HeaderBar";

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
    // skip scrolling when there are no messages to avoid whole page jump
    if (!messages.length) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
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
    <div style={{ height: "100%", padding: "18px 6px 18px 6px", boxSizing: "border-box" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          height: "100%",
        }}
      >
      <HeaderBar title="상담 메인" />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "300px minmax(460px, 1fr) 320px",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <CustListBar
              consultationRequests={consultationRequests}
              consultationHistory={consultationHistory}
              selectedRequest={selectedRequest}
              onClickRequest={handleRequestClick}
            />
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <MessageList
              selectedRequest={selectedRequest}
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              endConsultation={endConsultation}
              messagesEndRef={messagesEndRef}
            />
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <CustDetailBar
              selectedRequest={selectedRequest}
              consultationHistory={consultationHistory}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
