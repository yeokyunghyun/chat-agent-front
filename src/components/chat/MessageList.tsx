import { type Message, type ConsultationRequest } from '@/types';

interface Props {
  selectedRequest: ConsultationRequest | null;
  messages: Message[];
  inputMessage: string;
  setInputMessage: (v: string) => void;
  sendMessage: () => void;
  endConsultation: () => void;
  messagesEndRef: any;
}

export default function MessageList({
  selectedRequest,
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  endConsultation,
  messagesEndRef,
}: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #ddd",
      }}
    >
      {!selectedRequest ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#777",
          }}
        >
          상담 요청을 선택하세요.
        </div>
      ) : (
        <>
          {/* 헤더 */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3>{selectedRequest.customerName}님과의 상담</h3>
              <div style={{ fontSize: "12px", color: "#666" }}>
                고객 ID: {selectedRequest.customerId}
              </div>
            </div>
            <button
              onClick={endConsultation}
              style={{
                padding: "8px 16px",
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              상담 종료
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              background: "#f7f7f7",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  textAlign: msg.userId === "agent" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: msg.userId === "agent" ? "#2196F3" : "white",
                    color: msg.userId === "agent" ? "white" : "black",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              style={{ flex: 1, padding: "10px" }}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              전송
            </button>
          </div>
        </>
      )}
    </div>
  );
}
