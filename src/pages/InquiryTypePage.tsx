export default function InquiryTypePage() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "720px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <h1 style={{ margin: "0 0 12px 0", fontSize: "22px" }}>문의유형 관리</h1>
      <p style={{ margin: "0 0 12px 0", color: "#4b5563", lineHeight: 1.6 }}>
        예시 페이지입니다. 실제 API 연동 없이 임의로 구성했습니다.
      </p>
      <ul style={{ margin: 0, paddingLeft: "20px", color: "#111827" }}>
        <li>새 문의 유형 추가</li>
        <li>기존 유형 수정</li>
        <li>비활성화/삭제 처리</li>
      </ul>
    </div>
  );
}

