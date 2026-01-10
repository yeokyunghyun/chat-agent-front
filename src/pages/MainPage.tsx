import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import CustListBar from "@/components/chat/CustListBar"
import MessageList from '@/components/chat/MessageList'
import CustDetailBar from '@/components/chat/CustDetailBar'

import { type Message, type ConsultationRequest } from "@/types/chat";
import HeaderBar from "@/components/common/HeaderBar";
import { selectAuthUsername } from "@/selectors/auth";

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [messagesByRequest, setMessagesByRequest] = useState<Record<string, Message[]>>({});
  const [chatStatus, setChatStatus] = useState<"READY" | "NOT_READY">("NOT_READY");
  const clientRef = useRef<any>(null);
  const selectedRequestRef = useRef<ConsultationRequest | null>(null);
  const messageSubsRef = useRef<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userName = useSelector(selectAuthUsername);

  const accessToken = localStorage.getItem("ACCESS_TOKEN");

  // 초기 상태 조회
  useEffect(() => {
    fetch("/api/stat/select", { 
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.text())
      .then((status) => {
        if (status === "READY" || status === "NOT_READY") {
          setChatStatus(status);
        }
      })
      .catch(console.error);
  }, []);

  const handleChatStatusChange = (newStatus: "READY" | "NOT_READY") => {
    setChatStatus(newStatus);
    // 필요시 서버에 상태 변경 요청
    fetch("/api/stat/update", { 
      method: "POST", 
      headers: { 
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status : newStatus }),
    });
  };

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
      client.subscribe("/topic/agent/requests/" + userName, (msg) => {
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
          const prevList = prevMap[req.customerId] ?? [];
          const next = [...prevList, parsed];

          // 현재 보고 있는 상담이면 실시간으로 화면에도 반영
          if (selectedRequestRef.current?.customerId === req.customerId) {
            setMessages(next);
          }

          return {
            ...prevMap,
            [req.customerId]: next,
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
      prev.map((item) => (item.customerId === req.customerId ? next : item))
    );
    setSelectedRequest(next);
    setMessages(messagesByRequest[req.customerId] ?? []);
  };

  // 메시지 전송
  const sendMessage = () => {
    if (!selectedRequest || !inputMessage.trim()) return;
    if (!clientRef.current?.connected) return;

    const msg: Message = {
      userId: userName,
      customerId: selectedRequest.customerId,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    clientRef.current.send("/app/agent/send", {}, JSON.stringify(msg));
    
    setMessages((prev) => [...prev, msg]);

    setMessagesByRequest((prevMap) => ({
      ...prevMap,
      [selectedRequest.customerId]: [...(prevMap[selectedRequest.customerId] ?? []), msg],
    }));

    setInputMessage("");
  };

  // 상담 종료 (후처리 단계로 이동)
  const confirmEndConsultation = () => {
    if (!selectedRequest) return;

    setConsultationRequests((prev) =>
      prev.map((item) =>
        item.customerId === selectedRequest.customerId ? { ...item, status: "post_process" } : item
      )
    );

    setSelectedRequest((prev) => prev ? { ...prev, status: "post_process" } : null);
  };

  // 상태 변경 핸들러
  const handleStatusChange = (customerId: string, status: ConsultationRequest["status"]) => {
    setConsultationRequests((prev) =>
      prev.map((item) =>
        item.customerId === customerId ? { ...item, status } : item
      )
    );

    if (selectedRequest?.customerId === customerId) {
      setSelectedRequest((prev) => prev ? { ...prev, status } : null);
    }
  };

  // 상담 저장 핸들러
  const handleSaveConsultation = async (data: {
    aiSummary?: string;
    memo?: string;
    tags?: string[];
    category?: string;
  }) => {
    if (!selectedRequest) return;
    console.log("상담 저장 데이터:", data);
    // 저장 로직은 CustDetailBar에서 이미 처리됨
  };

  return (
    <div style={{ height: "100%", padding: "18px 6px 18px 6px", boxSizing: "border-box" }}>
      <div
        style={{
          maxWidth: "1600px",
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
            gridTemplateColumns: "300px minmax(460px, 1fr) minmax(350px, 400px)",
            gap: "12px",
            overflow: "hidden",
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
              chatStatus={chatStatus}
              onChatStatusChange={handleChatStatusChange}
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
              currentUserId={userName || ""}
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
              minWidth: 0,
            }}
          >
            <CustDetailBar
              selectedRequest={selectedRequest}
              messages={messages}
              onStatusChange={handleStatusChange}
              onSave={handleSaveConsultation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
