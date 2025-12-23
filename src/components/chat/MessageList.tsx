import { useState } from "react";

import ConfirmModal from "@/components/common/ConfirmModal";
import { type Message, type ConsultationRequest } from "@/types";

interface Props {
  selectedRequest: ConsultationRequest | null;
  messages: Message[];
  inputMessage: string;
  setInputMessage: (v: string) => void;
  sendMessage: () => void;
  onConfirmEnd?: () => void;
  messagesEndRef: any;
  currentUserId: string;
}

export default function MessageList({
  selectedRequest,
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  onConfirmEnd,
  messagesEndRef,
  currentUserId,
}: Props) {
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);

  const handleClickEnd = () => setIsEndConfirmOpen(true);

  const handleConfirmEnd = () => {
    onConfirmEnd?.();
    setIsEndConfirmOpen(false);
  };

  const handleCancelEnd = () => setIsEndConfirmOpen(false);

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
              padding: "10px 14px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ lineHeight: 1.3 }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>
                {selectedRequest.customerName}({selectedRequest.customerId})님과의 상담
              </h3>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              background: "#f7f7f7",
            }}
          >
            {messages.map((msg, i) => {
              const isCurrentUser = msg.userId === currentUserId;
              return (
                <div
                  key={i}
                  style={{
                    marginBottom: "12px",
                    textAlign: isCurrentUser ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: isCurrentUser ? "#2196F3" : "white",
                      color: isCurrentUser ? "white" : "black",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              style={{ flex: 1, padding: "9px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="메시지를 입력하세요..."
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "9px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              전송
            </button>
            <button
              onClick={handleClickEnd}
              style={{
                padding: "9px 12px",
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              상담 종료
            </button>
          </div>

          <ConfirmModal
            open={isEndConfirmOpen}
            title="상담을 종료하시겠습니까?"
            description="예를 누르면 현재 고객 상담이 종료되고 목록에서 상태가 '상담 종료'로 변경됩니다."
            confirmText="예"
            cancelText="아니요"
            onCancel={handleCancelEnd}
            onConfirm={handleConfirmEnd}
          />
        </>
      )}
    </div>
  );
}
