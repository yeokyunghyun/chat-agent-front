import { useEffect, useState, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

interface Message {
  userId: string;
  content: string;
  timestamp?: string;
}

interface ConsultationRequest {
  id: string;
  customerId: string;
  customerName: string;
  requestTime: string;
  status: "pending" | "active" | "completed";
}

interface ConsultationHistory {
  id: string;
  customerId: string;
  customerName: string;
  startTime: string;
  endTime: string;
  messages: Message[];
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<"history" | "info">("history");
  const clientRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8443/ws");
    const client = Stomp.over(socket);
    clientRef.current = client;

    client.connect({}, () => {
      console.log("WS connected");

      // 상담 요청 알림 구독
      client.subscribe("/topic/agent/requests", (msg) => {
        try {
          const request: ConsultationRequest = JSON.parse(msg.body);
          setConsultationRequests((prev) => [request, ...prev]);
        } catch (e) {
          console.error("Failed to parse request:", e);
        }
      });

      // 채팅 메시지 구독
      client.subscribe("/topic/agent", (msg) => {
        let body: Message;
        try {
          body = JSON.parse(msg.body);
          if (selectedRequest) {
            setMessages((prev) => [...prev, body]);
          }
        } catch (e) {
          console.error("Failed to parse message:", e);
        }
      });
    });

    // 더미 데이터 (개발용)
    setConsultationRequests([
      {
        id: "1",
        customerId: "customer1",
        customerName: "홍길동",
        requestTime: new Date().toLocaleString(),
        status: "pending",
      },
      {
        id: "2",
        customerId: "customer2",
        customerName: "김철수",
        requestTime: new Date(Date.now() - 3600000).toLocaleString(),
        status: "pending",
      },
    ]);

    setConsultationHistory([
      {
        id: "hist1",
        customerId: "customer3",
        customerName: "이영희",
        startTime: new Date(Date.now() - 86400000).toLocaleString(),
        endTime: new Date(Date.now() - 86400000 + 1800000).toLocaleString(),
        messages: [
          { userId: "customer3", content: "안녕하세요", timestamp: new Date().toISOString() },
          { userId: "agent", content: "네, 안녕하세요", timestamp: new Date().toISOString() },
        ],
      },
    ]);

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.disconnect(() => console.log("WS disconnected"));
      }
    };
  }, []);

  const handleRequestClick = (request: ConsultationRequest) => {
    setSelectedRequest(request);
    setMessages([]);
    // 상담 시작 처리
    setConsultationRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "active" } : r))
    );
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedRequest || !clientRef.current?.connected) return;

    const message: Message = {
      userId: "agent",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    // 메시지 전송 (실제 엔드포인트는 백엔드에 맞게 수정 필요)
    clientRef.current.send(
      `/app/chat/${selectedRequest.customerId}`,
      {},
      JSON.stringify(message)
    );

    setMessages((prev) => [...prev, message]);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endConsultation = () => {
    if (selectedRequest) {
      setConsultationHistory((prev) => [
        ...prev,
        {
          id: `hist_${Date.now()}`,
          customerId: selectedRequest.customerId,
          customerName: selectedRequest.customerName,
          startTime: selectedRequest.requestTime,
          endTime: new Date().toLocaleString(),
          messages: messages,
        },
      ]);
      setConsultationRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id ? { ...r, status: "completed" } : r
        )
      );
      setSelectedRequest(null);
      setMessages([]);
    }
  };

  return (
    <div style={styles.container}>
      {/* 1번 영역: 상담 내역 및 요청 목록 */}
      <div style={styles.leftPanel}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>상담 요청</h3>
          <div style={styles.requestList}>
            {consultationRequests
              .filter((r) => r.status === "pending")
              .map((request) => (
                <div
                  key={request.id}
                  style={{
                    ...styles.requestItem,
                    ...(selectedRequest?.id === request.id ? styles.selectedItem : {}),
                  }}
                  onClick={() => handleRequestClick(request)}
                >
                  <div style={styles.requestName}>{request.customerName}</div>
                  <div style={styles.requestTime}>{request.requestTime}</div>
                </div>
              ))}
            {consultationRequests.filter((r) => r.status === "pending").length === 0 && (
              <div style={styles.emptyText}>대기 중인 상담 요청이 없습니다</div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>상담 내역</h3>
          <div style={styles.historyList}>
            {consultationHistory.map((history) => (
              <div
                key={history.id}
                style={styles.historyItem}
                onClick={() => {
                  setSelectedRequest({
                    id: history.id,
                    customerId: history.customerId,
                    customerName: history.customerName,
                    requestTime: history.startTime,
                    status: "completed",
                  });
                  setMessages(history.messages);
                }}
              >
                <div style={styles.historyName}>{history.customerName}</div>
                <div style={styles.historyTime}>{history.startTime}</div>
              </div>
            ))}
            {consultationHistory.length === 0 && (
              <div style={styles.emptyText}>상담 내역이 없습니다</div>
            )}
          </div>
        </div>
      </div>

      {/* 2번 영역: 채팅 상담 영역 */}
      <div style={styles.centerPanel}>
        {selectedRequest ? (
          <>
            <div style={styles.chatHeader}>
              <div>
                <h3 style={styles.chatTitle}>{selectedRequest.customerName}님과의 상담</h3>
                <div style={styles.chatSubtitle}>고객 ID: {selectedRequest.customerId}</div>
              </div>
              <button style={styles.endButton} onClick={endConsultation}>
                상담 종료
              </button>
            </div>
            <div style={styles.chatMessages}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.messageItem,
                    ...(msg.userId === "agent" ? styles.agentMessage : styles.customerMessage),
                  }}
                >
                  <div
                    style={{
                      ...styles.messageContent,
                      ...(msg.userId === "agent"
                        ? styles.agentMessageContent
                        : styles.customerMessageContent),
                    }}
                  >
                    {msg.content}
                  </div>
                  <div style={styles.messageTime}>
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString()
                      : new Date().toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={styles.chatInput}>
              <input
                style={styles.input}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
              />
              <button style={styles.sendButton} onClick={sendMessage}>
                전송
              </button>
            </div>
          </>
        ) : (
          <div style={styles.emptyChat}>
            <div style={styles.emptyChatText}>
              왼쪽에서 상담 요청을 선택하거나 상담 내역을 클릭하세요
            </div>
          </div>
        )}
      </div>

      {/* 3번 영역: 고객 정보 및 상담 이력 */}
      <div style={styles.rightPanel}>
        {selectedRequest ? (
          <>
            <div style={styles.tabContainer}>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === "history" ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab("history")}
              >
                상담 이력
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === "info" ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab("info")}
              >
                고객 정보
              </button>
            </div>
            <div style={styles.tabContent}>
              {activeTab === "history" ? (
                <div>
                  <h4 style={styles.tabTitle}>과거 상담 이력</h4>
                  <div style={styles.customerHistoryList}>
                    {consultationHistory
                      .filter((h) => h.customerId === selectedRequest.customerId)
                      .map((history) => (
                        <div key={history.id} style={styles.customerHistoryItem}>
                          <div style={styles.customerHistoryDate}>
                            {history.startTime} ~ {history.endTime}
                          </div>
                          <div style={styles.customerHistoryMessages}>
                            {history.messages.length}개의 메시지
                          </div>
                        </div>
                      ))}
                    {consultationHistory.filter(
                      (h) => h.customerId === selectedRequest.customerId
                    ).length === 0 && (
                      <div style={styles.emptyText}>과거 상담 이력이 없습니다</div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 style={styles.tabTitle}>고객 정보</h4>
                  <div style={styles.customerInfo}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>고객명:</span>
                      <span style={styles.infoValue}>{selectedRequest.customerName}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>고객 ID:</span>
                      <span style={styles.infoValue}>{selectedRequest.customerId}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>상담 상태:</span>
                      <span style={styles.infoValue}>
                        {selectedRequest.status === "active" ? "진행 중" : "대기 중"}
                      </span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>요청 시간:</span>
                      <span style={styles.infoValue}>{selectedRequest.requestTime}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={styles.emptyRightPanel}>
            <div style={styles.emptyText}>고객을 선택하면 정보를 확인할 수 있습니다</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
  leftPanel: {
    width: "300px",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  section: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sectionTitle: {
    margin: "16px",
    fontSize: "16px",
    fontWeight: "bold",
    borderBottom: "2px solid #2196F3",
    paddingBottom: "8px",
  },
  requestList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  requestItem: {
    padding: "12px",
    marginBottom: "8px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  selectedItem: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  requestName: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  requestTime: {
    fontSize: "12px",
    color: "#666",
  },
  historyList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  historyItem: {
    padding: "12px",
    marginBottom: "8px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  historyName: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  historyTime: {
    fontSize: "12px",
    color: "#666",
  },
  centerPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e0e0e0",
  },
  chatHeader: {
    padding: "16px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
  },
  chatSubtitle: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
  endButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    backgroundColor: "#f5f5f5",
  },
  messageItem: {
    marginBottom: "12px",
    maxWidth: "70%",
  },
  agentMessage: {
    marginLeft: "auto",
    textAlign: "right",
  },
  customerMessage: {
    marginRight: "auto",
  },
  messageContent: {
    padding: "10px 14px",
    borderRadius: "12px",
    display: "inline-block",
    fontSize: "14px",
    wordBreak: "break-word",
  },
  agentMessageContent: {
    backgroundColor: "#2196F3",
    color: "white",
  },
  customerMessageContent: {
    backgroundColor: "white",
    color: "#333",
  },
  messageTime: {
    fontSize: "11px",
    color: "#999",
    marginTop: "4px",
    padding: "0 4px",
  },
  chatInput: {
    padding: "16px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    fontSize: "14px",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  emptyChat: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChatText: {
    fontSize: "16px",
    color: "#999",
  },
  rightPanel: {
    width: "300px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  tabContainer: {
    display: "flex",
    borderBottom: "1px solid #e0e0e0",
  },
  tab: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    borderBottom: "2px solid transparent",
  },
  activeTab: {
    borderBottomColor: "#2196F3",
    color: "#2196F3",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
  },
  tabTitle: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    fontWeight: "bold",
  },
  customerHistoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  customerHistoryItem: {
    padding: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
  },
  customerHistoryDate: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "4px",
  },
  customerHistoryMessages: {
    fontSize: "14px",
    color: "#333",
  },
  customerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  infoLabel: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: "14px",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
    padding: "20px",
  },
  emptyRightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
