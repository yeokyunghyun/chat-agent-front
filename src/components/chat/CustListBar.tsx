import {
  type ConsultationRequest,
  type ConsultationHistory,
} from '@/types'

interface Props {
  consultationRequests: ConsultationRequest[];
  consultationHistory: ConsultationHistory[];
  selectedRequest: ConsultationRequest | null;
  onClickRequest: (req: ConsultationRequest) => void;
}

export default function LeftPanel({
  consultationRequests,
  consultationHistory,
  selectedRequest,
  onClickRequest,
}: Props) {
  return (
    <div
      style={{
        width: "300px",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ padding: "16px", borderBottom: "2px solid #2196F3" }}>
        상담 요청
      </h3>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {consultationRequests.map((req) => (
          <div
            key={req.id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background:
                selectedRequest?.id === req.id ? "#E3F2FD" : "white",
              cursor: "pointer",
            }}
            onClick={() => onClickRequest(req)}
          >
            <div style={{ fontWeight: "bold" }}>{req.customerName}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {req.requestTime}
            </div>
          </div>
        ))}
      </div>

      {/* 상담 내역 */}
      <h3 style={{ padding: "16px", borderBottom: "2px solid #2196F3" }}>
        상담 내역
      </h3>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {consultationHistory.map((history) => (
          <div
            key={history.id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {history.customerName}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {history.startTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
