import { useEffect, useState } from "react";
import { type ConsultationRequest, type Message } from "@/types/chat";

interface Props {
  selectedRequest: ConsultationRequest | null;
  messages: Message[];
}

export default function CustDetailBar({
  selectedRequest,
  messages,
}: Props) {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");

  const statusLabels: Record<ConsultationRequest["status"], string> = {
    pending: "상담 요청",
    in_progress: "상담 중",
    post_process: "후처리",
    closed: "상담 종료",
  };

  useEffect(() => {
    // 새 고객을 선택하면 기본 탭을 고객 정보로 리셋
    if (selectedRequest) setActiveTab("info");
  }, [selectedRequest?.id]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
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
          고객을 선택하세요.
        </div>
      ) : (
        <>
          <div style={{ borderBottom: "1px solid #e5e7eb", display: "flex" }}>
            {[
              { key: "info", label: "고객 정보" },
              { key: "history", label: "상담 이력" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "info" | "history")}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    border: "none",
                    borderBottom: isActive ? "3px solid #2196F3" : "3px solid transparent",
                    background: isActive ? "#f5f9ff" : "transparent",
                    fontWeight: 700,
                    color: isActive ? "#0d47a1" : "#555",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
            {activeTab === "info" ? (
              <div style={{ display: "grid", gap: "10px" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>고객명</div>
                  <div>{selectedRequest.customerName}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>고객 ID</div>
                  <div>{selectedRequest.customerId}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>상태</div>
                  <div>{statusLabels[selectedRequest.status]}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>요청 시간</div>
                  <div>{selectedRequest.requestTime}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.length === 0 ? (
                  <div style={{ color: "#888", fontSize: "13px" }}>상담 이력이 없습니다.</div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={`${msg.timestamp ?? idx}-${idx}`}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "#f8f9fa",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: "13px", color: "#111" }}>
                        {msg.userId === "agent" ? "상담원" : "고객"}
                      </div>
                      <div style={{ fontSize: "14px" }}>{msg.content}</div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleString()
                          : "시간 정보 없음"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
