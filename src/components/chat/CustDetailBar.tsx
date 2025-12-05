import {
  type ConsultationRequest,
  type ConsultationHistory,
} from "@/types";

interface Props {
  selectedRequest: ConsultationRequest | null;
  consultationHistory: ConsultationHistory[];
  activeTab: "history" | "info";
  setActiveTab: (v: "history" | "info") => void;
}

export default function RightPanel({
  selectedRequest,
  consultationHistory,
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div
      style={{
        width: "300px",
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
          {/* 탭 */}
          <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
            <button
              onClick={() => setActiveTab("history")}
              style={{
                flex: 1,
                padding: "12px",
                borderBottom: activeTab === "history" ? "2px solid #2196F3" : "none",
              }}
            >
              상담 이력
            </button>
            <button
              onClick={() => setActiveTab("info")}
              style={{
                flex: 1,
                padding: "12px",
                borderBottom: activeTab === "info" ? "2px solid #2196F3" : "none",
              }}
            >
              고객 정보
            </button>
          </div>

          {/* 콘텐츠 */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
            {activeTab === "info" ? (
              <div>
                <div>고객명: {selectedRequest.customerName}</div>
                <div>고객 ID: {selectedRequest.customerId}</div>
                <div>상태: {selectedRequest.status}</div>
              </div>
            ) : (
              <div>
                <h4>상담 기록</h4>
                {consultationHistory
                  .filter((h) => h.customerId === selectedRequest.customerId)
                  .map((h) => (
                    <div key={h.id} style={{ marginBottom: "10px" }}>
                      <div>{h.startTime} ~ {h.endTime}</div>
                      <div>{h.messages.length}개 메시지</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
