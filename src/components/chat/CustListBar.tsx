import { useMemo, useState } from "react";
import { type ConsultationRequest } from "@/types";

interface Props {
  consultationRequests: ConsultationRequest[];
  selectedRequest: ConsultationRequest | null;
  onClickRequest: (req: ConsultationRequest) => void;
  chatStatus: "READY" | "NOT_READY";
  onChatStatusChange: (status: "READY" | "NOT_READY") => void;
}

export default function CustListBar({
  consultationRequests,
  selectedRequest,
  onClickRequest,
  chatStatus,
  onChatStatusChange,
}: Props) {
  const statusFilters = [
    { value: "pending", label: "상담 요청" },
    { value: "in_progress", label: "상담 중" },
    { value: "post_process", label: "후처리" },
    { value: "closed", label: "상담 종료" },
  ] as const;

  const [enabledStatus, setEnabledStatus] = useState<Record<string, boolean>>({
    pending: true,
    in_progress: true,
    post_process: true,
    closed: true,
  });

  const filteredRequests = useMemo(
    () => consultationRequests.filter((req) => enabledStatus[req.status]),
    [consultationRequests, enabledStatus]
  );

  const toggleStatus = (value: string) => {
    setEnabledStatus((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  const handleClickRequest = async (req: ConsultationRequest) => {

    onClickRequest(req);

    // 2) 상담 시작 알림 API 호출
    try {
      const res = await fetch("/api/agent/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
        },
        body: JSON.stringify({
          customerId: req.customerId,
          customerName: req.customerName,
          requestTime: req.requestTime,
          status: req.status,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("startConsultation failed:", res.status, text);
      }
    } catch (e) {
      console.error("startConsultation error:", e);
    }

  };

  return (
    <div
      style={{
        width: "100%",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px 16px 8px 16px",
          margin: 0,
          borderBottom: "2px solid #2196F3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ margin: 0 }}>상담 요청</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: chatStatus === "READY" ? "#22c55e" : "#ef4444",
            }}
          />
          <select
            value={chatStatus}
            onChange={(e) => onChatStatusChange(e.target.value as "READY" | "NOT_READY")}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              background: chatStatus === "READY" ? "#dcfce7" : "#fee2e2",
              color: chatStatus === "READY" ? "#166534" : "#991b1b",
            }}
          >
            <option value="READY">채팅 ON</option>
            <option value="NOT_READY">채팅 OFF</option>
          </select>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {filteredRequests.map((req) => (
          <div
            key={req.customerId}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background:
                selectedRequest?.customerId === req.customerId ? "#E3F2FD" : "white",
              cursor: "pointer",
            }}
            onClick={() => handleClickRequest(req)}
          >
            <div style={{ fontWeight: "bold" }}>{req.customerName}</div>
            <div style={{ fontSize: "12px", color: "#2196F3", marginTop: "4px" }}>
              {statusFilters.find((s) => s.value === req.status)?.label ?? req.status}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {req.requestTime}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px", borderTop: "1px solid #eee" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${statusFilters.length}, 1fr)`,
            gap: "8px",
          }}
        >
          {statusFilters.map((filter) => {
            const active = enabledStatus[filter.value];
            return (
              <button
                key={filter.value}
                onClick={() => toggleStatus(filter.value)}
                style={{
                  padding: "10px 0",
                  width: "100%",
                  borderRadius: "8px",
                  border: active ? "1px solid #2196F3" : "1px solid #ccc",
                  background: active ? "#E3F2FD" : "#f8f9fa",
                  color: active ? "#0d47a1" : "#555",
                  cursor: "pointer",
                  minHeight: "22px",
                  fontSize: "12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  lineHeight: "1.2",
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
