import { useEffect, useState } from "react";
import { type ConsultationRequest, type Message } from "@/types/chat";

interface Props {
  selectedRequest: ConsultationRequest | null;
  messages: Message[];
  onStatusChange?: (customerId: string, status: ConsultationRequest["status"]) => void;
  onSave?: (data: PostProcessData) => void;
}

interface PostProcessData {
  aiSummary?: string;
  memo?: string;
  tags?: string[];
  category?: string;
}

export default function CustDetailBar({
  selectedRequest,
  messages,
  onStatusChange,
  onSave,
}: Props) {
  const [activeTab, setActiveTab] = useState<"info" | "history" | "postprocess">("info");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [memo, setMemo] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const statusLabels: Record<ConsultationRequest["status"], string> = {
    pending: "상담 요청",
    in_progress: "상담 중",
    post_process: "후처리",
    closed: "상담 종료",
  };

  const categoryOptions = [
    { value: "", label: "선택 안함" },
    { value: "product_inquiry", label: "제품 문의" },
    { value: "technical_support", label: "기술 지원" },
    { value: "complaint", label: "불만 사항" },
    { value: "praise", label: "칭찬" },
    { value: "suggestion", label: "제안" },
    { value: "etc", label: "기타" },
  ];

  useEffect(() => {
    // 새 고객을 선택하면 기본 탭을 후처리로 설정
    if (selectedRequest) {
      setActiveTab("postprocess");
      // 데이터 초기화
      setAiSummary("");
      setMemo("");
      setTags([]);
      setCategory("");
    }
  }, [selectedRequest?.customerId, selectedRequest?.status]);

  // AI 요약 생성
  const handleGenerateSummary = async () => {
    if (!selectedRequest || messages.length === 0) return;

    setIsGeneratingSummary(true);
    try {
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          customerId: selectedRequest.customerId,
          messages: messages.map((msg) => ({
            userId: msg.userId,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.summary || "요약 생성에 실패했습니다.");
      } else {
        setAiSummary("요약 생성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("AI 요약 생성 오류:", error);
      setAiSummary("요약 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 상담 저장
  const handleSaveConsultation = async () => {
    if (!selectedRequest) return;

    setIsSaving(true);
    try {
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      const postProcessData: PostProcessData = {
        aiSummary,
        memo,
        tags,
        category: category || undefined,
      };

      const response = await fetch("/api/consultation/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          customerId: selectedRequest.customerId,
          ...postProcessData,
        }),
      });

      if (response.ok) {
        onSave?.(postProcessData);
        onStatusChange?.(selectedRequest.customerId, "closed");
        alert("상담이 저장되었습니다.");
      } else {
        alert("상담 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("상담 저장 오류:", error);
      alert("상담 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 후처리 완료 (저장 없이 상태만 변경)
  const handleCompletePostProcess = () => {
    if (!selectedRequest) return;
    onStatusChange?.(selectedRequest.customerId, "closed");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflow: "hidden",
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
              { key: "postprocess", label: "후처리" },
              { key: "info", label: "고객 정보" },
              { key: "history", label: "상담 이력" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "info" | "history" | "postprocess")}
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

          <div style={{ flex: 1, padding: "16px", overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>
            {activeTab === "info" ? (
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "13px" }}>고객명</div>
                  <div style={{ fontSize: "14px", color: "#333" }}>{selectedRequest.customerName}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "13px" }}>고객 ID</div>
                  <div style={{ fontSize: "14px", color: "#333" }}>{selectedRequest.customerId}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "13px" }}>상태</div>
                  <div style={{ fontSize: "14px", color: "#333" }}>{statusLabels[selectedRequest.status]}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "13px" }}>요청 시간</div>
                  <div style={{ fontSize: "14px", color: "#333" }}>{selectedRequest.requestTime}</div>
                </div>
              </div>
            ) : activeTab === "history" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.length === 0 ? (
                  <div style={{ color: "#888", fontSize: "13px", textAlign: "center", padding: "20px" }}>
                    상담 이력이 없습니다.
                  </div>
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
                      <div style={{ fontSize: "14px", color: "#333", wordBreak: "break-word" }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleString()
                          : "시간 정보 없음"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // 후처리 탭
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0, width: "100%" }}>
                {/* AI 상담 요약 섹션 */}
                <div style={{ minWidth: 0, width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "8px", minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#111", minWidth: 0, flexShrink: 1 }}>
                      AI 상담 요약
                    </div>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary || messages.length === 0 || selectedRequest.status !== "post_process"}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: isGeneratingSummary || selectedRequest.status !== "post_process" ? "#ccc" : "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: isGeneratingSummary || messages.length === 0 || selectedRequest.status !== "post_process" ? "not-allowed" : "pointer",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isGeneratingSummary ? "생성 중..." : "요약 생성"}
                    </button>
                  </div>
                  <textarea
                    value={aiSummary}
                    onChange={(e) => setAiSummary(e.target.value)}
                    disabled={selectedRequest.status !== "post_process"}
                    placeholder={isGeneratingSummary ? "AI가 상담 내용을 분석 중입니다..." : "AI 요약 생성 버튼을 클릭하거나 직접 입력하세요."}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      minHeight: "120px",
                      padding: "10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      resize: "vertical",
                      backgroundColor: selectedRequest.status !== "post_process" ? "#f5f5f5" : "white",
                      color: selectedRequest.status !== "post_process" ? "#666" : "#333",
                      cursor: selectedRequest.status !== "post_process" ? "not-allowed" : "text",
                      boxSizing: "border-box",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  />
                </div>

                {/* 카테고리 선택 */}
                <div style={{ minWidth: 0, width: "100%" }}>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#111", marginBottom: "8px" }}>
                    상담 카테고리
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={selectedRequest.status !== "post_process"}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "13px",
                      backgroundColor: selectedRequest.status !== "post_process" ? "#f5f5f5" : "white",
                      color: selectedRequest.status !== "post_process" ? "#666" : "#333",
                      cursor: selectedRequest.status !== "post_process" ? "not-allowed" : "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 태그 섹션 */}
                <div style={{ minWidth: 0, width: "100%" }}>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#111", marginBottom: "8px" }}>
                    태그
                  </div>
                  {selectedRequest.status === "post_process" && (
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px", minWidth: 0 }}>
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="태그를 입력하고 Enter"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          maxWidth: "100%",
                          padding: "6px 10px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          fontSize: "13px",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        onClick={handleAddTag}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        추가
                      </button>
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "32px", minWidth: 0, width: "100%" }}>
                    {tags.length === 0 ? (
                      <div style={{ color: "#999", fontSize: "12px", padding: "4px" }}>태그가 없습니다.</div>
                    ) : (
                      tags.map((tag) => (
                        <div
                          key={tag}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            backgroundColor: "#E3F2FD",
                            color: "#1976D2",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "100%",
                            wordBreak: "break-word",
                          }}
                        >
                          <span style={{ overflowWrap: "break-word" }}>{tag}</span>
                          {selectedRequest.status === "post_process" && (
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#1976D2",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                                padding: 0,
                                width: "16px",
                                height: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 메모 섹션 */}
                <div style={{ minWidth: 0, width: "100%" }}>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#111", marginBottom: "8px" }}>
                    상담 메모
                  </div>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    disabled={selectedRequest.status !== "post_process"}
                    placeholder="상담에 대한 추가 메모를 입력하세요."
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      minHeight: "100px",
                      padding: "10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      resize: "vertical",
                      backgroundColor: selectedRequest.status !== "post_process" ? "#f5f5f5" : "white",
                      color: selectedRequest.status !== "post_process" ? "#666" : "#333",
                      cursor: selectedRequest.status !== "post_process" ? "not-allowed" : "text",
                      boxSizing: "border-box",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  />
                </div>

                {/* 저장 버튼 */}
                {selectedRequest.status === "post_process" && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", minWidth: 0, width: "100%" }}>
                    <button
                      onClick={handleSaveConsultation}
                      disabled={isSaving}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        padding: "10px",
                        backgroundColor: isSaving ? "#ccc" : "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: isSaving ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {isSaving ? "저장 중..." : "상담 저장"}
                    </button>
                    <button
                      onClick={handleCompletePostProcess}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      완료
                    </button>
                  </div>
                )}

                {selectedRequest.status !== "post_process" && selectedRequest.status !== "closed" && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      border: "1px solid #ffc107",
                      borderRadius: "6px",
                      color: "#856404",
                      fontSize: "13px",
                      textAlign: "center",
                    }}
                  >
                    상담 종료 후 후처리 단계에서 입력할 수 있습니다.
                  </div>
                )}

                {selectedRequest.status === "closed" && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#f0f7ff",
                      border: "1px solid #b3d9ff",
                      borderRadius: "6px",
                      color: "#1976D2",
                      fontSize: "13px",
                      textAlign: "center",
                    }}
                  >
                    상담이 종료되었습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
