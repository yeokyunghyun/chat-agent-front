import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import CustListBar from "@/components/chat/CustListBar"
import MessageList from '@/components/chat/MessageList'
import CustDetailBar from '@/components/chat/CustDetailBar'

import { type Message, type ConsultationRequest } from "@/types/chat";
import HeaderBar from "@/components/common/HeaderBar";

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [messagesByRequest, setMessagesByRequest] = useState<Record<string, Message[]>>({});
  const clientRef = useRef<any>(null);
  const selectedRequestRef = useRef<ConsultationRequest | null>(null);
  const messageSubsRef = useRef<Record<string, any>>({});
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
        console.log("### req >>> :", req);
        
        setConsultationRequests((prev) => [req, ...prev]);
      });
    });

    // 더미 데이터
    setConsultationRequests([
      // {
      //   id: "1",
      //   customerId: "customer1",
      //   customerName: "홍길동",
      //   requestTime: new Date().toLocaleString(),
      //   status: "pending",
      // },
      // {
      //   id: "2",
      //   customerId: "customer2",
      //   customerName: "김철수",
      //   requestTime: new Date().toLocaleString(),
      //   status: "in_progress",
      // },
      // {
      //   id: "3",
      //   customerId: "customer3",
      //   customerName: "이영희",
      //   requestTime: new Date().toLocaleString(),
      //   status: "post_process",
      // },
      // {
      //   id: "4",
      //   customerId: "customer4",
      //   customerName: "박민수",
      //   requestTime: new Date().toLocaleString(),
      //   status: "closed",
      // },
    ]);

    return () => {
      if (clientRef.current?.connected) clientRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    selectedRequestRef.current = selectedRequest;
  }, [selectedRequest]);

  // 고객별 토픽 다중 구독 (상담 목록에 있는 모든 고객)
  useEffect(() => {
    const client = clientRef.current;
    if (!client || !client.connected) return;

    const subs = messageSubsRef.current;

    consultationRequests.forEach((req) => {
      const topic = `/topic/agent/${req.customerId}`;
      if (subs[topic]) return; // 이미 구독 중

      subs[topic] = client.subscribe(topic, (msg: any) => {
        const parsed: Message = JSON.parse(msg.body);

        setMessagesByRequest((prevMap) => {
          const prevList = prevMap[req.id] ?? [];
          const next = [...prevList, parsed];

          // 현재 보고 있는 상담이면 실시간으로 화면에도 반영
          if (selectedRequestRef.current?.id === req.id) {
            setMessages(next);
          }

          return {
            ...prevMap,
            [req.id]: next,
          };
        });
      });
    });

    return () => {
      Object.values(subs).forEach((sub) => sub?.unsubscribe?.());
      messageSubsRef.current = {};
    };
  }, [consultationRequests]);
  

  // 상담 요청 클릭
  const handleRequestClick = (req: ConsultationRequest) => {
    const next = { ...req, status: "in_progress" as const };
    setConsultationRequests((prev) =>
      prev.map((item) => (item.id === req.id ? next : item))
    );
    setSelectedRequest(next);
    setMessages(messagesByRequest[req.id] ?? []);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!selectedRequest || !inputMessage.trim()) return;

    const msg: Message = {
      userId: "agent",
      customerId: selectedRequest.customerId,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    await fetch("http://localhost:8443/api/agent/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
    
    setMessages((prev) => [...prev, msg]);

    setMessagesByRequest((prevMap) => ({
      ...prevMap,
      [selectedRequest.id]: [...(prevMap[selectedRequest.id] ?? []), msg],
    }));

    setInputMessage("");
  };

  // 상담 종료
  const confirmEndConsultation = () => {
    if (!selectedRequest) return;

    setConsultationRequests((prev) =>
      prev.map((item) =>
        item.id === selectedRequest.id ? { ...item, status: "closed" } : item
      )
    );

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
              onConfirmEnd={confirmEndConsultation}
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
              messages={messages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
