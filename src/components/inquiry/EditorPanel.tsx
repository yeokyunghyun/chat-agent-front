import EmptyState from "./EmptyState";
import PanelHeader from "./PanelHeader";
import { inputStyle, panelStyle, primaryButton, secondaryButton } from "./styles";
import type { TreeNode } from "@/types/inqry";

type ChildInquiryTypeModalProps = {
  newChildTitle: string;
  onNewChildTitleChange: (value: string) => void;
  newChildContent: string;
  onNewChildContentChange: (value: string) => void;
  newChildType: string;
  onNewChildTypeChange: (value: string) => void;
  onAddChild: () => void;
  onClose: () => void;
  validationErrors?: {
    title?: string;
    content?: string;
    type?: string;
  };
};

function ChildInquiryTypeModal({
  newChildTitle,
  onNewChildTitleChange,
  newChildContent,
  onNewChildContentChange,
  newChildType,
  onNewChildTypeChange,
  onAddChild,
  onClose,
  validationErrors,
}: ChildInquiryTypeModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "24px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>하위 문의 유형 추가</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280",
              padding: "0",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#374151" }}>
              제목 *
            </label>
            <input
              value={newChildTitle}
              onChange={(e) => onNewChildTitleChange(e.target.value)}
              placeholder="제목을 입력하세요"
              style={{
                ...inputStyle,
                width: "100%",
                boxSizing: "border-box",
                borderColor: validationErrors?.title ? "#ef4444" : "#d1d5db",
              }}
            />
            {validationErrors?.title && (
              <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                {validationErrors.title}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#374151" }}>
              내용 *
            </label>
            <textarea
              value={newChildContent}
              onChange={(e) => onNewChildContentChange(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={4}
              style={{
                ...inputStyle,
                width: "100%",
                boxSizing: "border-box",
                borderColor: validationErrors?.content ? "#ef4444" : "#d1d5db",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            {validationErrors?.content && (
              <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                {validationErrors.content}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#374151" }}>
              유형 *
            </label>
            <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <input
                    type="radio"
                    name="childType"
                    value="block"
                    checked={newChildType === "block"}
                    onChange={(e) => onNewChildTypeChange(e.target.value)}
                    style={{
                      cursor: "pointer",
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: "2px solid #d1d5db",
                      appearance: "none",
                      margin: 0,
                      backgroundColor: newChildType === "block" ? "#4f46e5" : "#fff",
                    }}
                  />
                  {newChildType === "block" && (
                    <span
                      style={{
                        position: "absolute",
                        left: "3px",
                        top: "0px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "bold",
                        pointerEvents: "none",
                        lineHeight: "18px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "14px" }}>연결블럭</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <input
                    type="radio"
                    name="childType"
                    value="counseling"
                    checked={newChildType === "counseling"}
                    onChange={(e) => onNewChildTypeChange(e.target.value)}
                    style={{
                      cursor: "pointer",
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: "2px solid #d1d5db",
                      appearance: "none",
                      margin: 0,
                      backgroundColor: newChildType === "counseling" ? "#4f46e5" : "#fff",
                    }}
                  />
                  {newChildType === "counseling" && (
                    <span
                      style={{
                        position: "absolute",
                        left: "3px",
                        top: "0px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "bold",
                        pointerEvents: "none",
                        lineHeight: "18px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "14px" }}>상담블럭</span>
              </label>
            </div>
            {validationErrors?.type && (
              <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                {validationErrors.type}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              style={{
                ...secondaryButton,
                flex: 1,
              }}
              onClick={onClose}
            >
              취소
            </button>
            <button
              style={{
                ...primaryButton,
                flex: 1,
              }}
              onClick={onAddChild}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type EditorPanelProps = {
  selectedNode: TreeNode | null;
  depth: number;
  currentTitle: string;
  currentNodeTitle: string;
  onCurrentNodeTitleChange: (value: string) => void;
  currentNodeContent: string;
  onCurrentNodeContentChange: (value: string) => void;
  currentNodeType: string;
  onCurrentNodeTypeChange: (value: string) => void;
  onUpdateCurrentNode: () => void;
  newChildTitle: string;
  onNewChildTitleChange: (value: string) => void;
  newChildContent: string;
  onNewChildContentChange: (value: string) => void;
  newChildType: string;
  onNewChildTypeChange: (value: string) => void;
  onAddChild: () => void;
  newRootLabel: string;
  onNewRootChange: (value: string) => void;
  onAddRoot: () => void;
  isEmpty: boolean;
  validationErrors?: {
    title?: string;
    content?: string;
    type?: string;
  };
  currentNodeValidationErrors?: {
    title?: string;
    content?: string;
    type?: string;
  };
  isChildModalOpen: boolean;
  onOpenChildModal: () => void;
  onCloseChildModal: () => void;
};

export default function EditorPanel({
  selectedNode,
  depth,
  currentTitle,
  currentNodeTitle,
  onCurrentNodeTitleChange,
  currentNodeContent,
  onCurrentNodeContentChange,
  currentNodeType,
  onCurrentNodeTypeChange,
  onUpdateCurrentNode,
  newChildTitle,
  onNewChildTitleChange,
  newChildContent,
  onNewChildContentChange,
  newChildType,
  onNewChildTypeChange,
  onAddChild,
  newRootLabel,
  onNewRootChange,
  onAddRoot,
  isEmpty,
  validationErrors,
  currentNodeValidationErrors,
  isChildModalOpen,
  onOpenChildModal,
  onCloseChildModal,
}: EditorPanelProps) {
  return (
    <section style={panelStyle}>
      <PanelHeader title="유형 수정 영역" />
      {selectedNode ? (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
            minHeight: 0,
          }}
        >

          {/* 자기 자신 노드 수정 섹션 */}
          <div
            style={{
              padding: "14px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              background: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ fontWeight: 700 }}>문의 유형 수정</div>
            
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#374151" }}>
                제목 *
              </label>
              <input
                value={currentNodeTitle}
                onChange={(e) => onCurrentNodeTitleChange(e.target.value)}
                placeholder="제목을 입력하세요"
                style={{
                  ...inputStyle,
                  width: "100%",
                  boxSizing: "border-box",
                  borderColor: currentNodeValidationErrors?.title ? "#ef4444" : "#d1d5db",
                }}
              />
              {currentNodeValidationErrors?.title && (
                <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                  {currentNodeValidationErrors.title}
                </div>
              )}
            </div>

            {currentNodeType !== "counseling" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "#374151",
                  }}
                >
                  내용 *
                </label>
                <textarea
                  value={currentNodeContent}
                  onChange={(e) => onCurrentNodeContentChange(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={4}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    boxSizing: "border-box",
                    borderColor: currentNodeValidationErrors?.content ? "#ef4444" : "#d1d5db",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                {currentNodeValidationErrors?.content && (
                  <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                    {currentNodeValidationErrors.content}
                  </div>
                )}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#374151" }}>
                유형 *
              </label>
              <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <input
                      type="radio"
                      name="currentNodeType"
                      value="block"
                      checked={currentNodeType === "block"}
                      onChange={(e) => onCurrentNodeTypeChange(e.target.value)}
                      style={{
                        cursor: "pointer",
                        width: "18px",
                        height: "18px",
                        borderRadius: "4px",
                        border: "2px solid #d1d5db",
                        appearance: "none",
                        margin: 0,
                        backgroundColor: currentNodeType === "block" ? "#4f46e5" : "#fff",
                      }}
                    />
                    {currentNodeType === "block" && (
                      <span
                        style={{
                          position: "absolute",
                          left: "3px",
                          top: "0px",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "bold",
                          pointerEvents: "none",
                          lineHeight: "18px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "14px" }}>연결블럭</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <input
                      type="radio"
                      name="currentNodeType"
                      value="counseling"
                      checked={currentNodeType === "counseling"}
                      onChange={(e) => onCurrentNodeTypeChange(e.target.value)}
                      style={{
                        cursor: "pointer",
                        width: "18px",
                        height: "18px",
                        borderRadius: "4px",
                        border: "2px solid #d1d5db",
                        appearance: "none",
                        margin: 0,
                        backgroundColor: currentNodeType === "counseling" ? "#4f46e5" : "#fff",
                      }}
                    />
                    {currentNodeType === "counseling" && (
                      <span
                        style={{
                          position: "absolute",
                          left: "3px",
                          top: "0px",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "bold",
                          pointerEvents: "none",
                          lineHeight: "18px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "14px" }}>상담블럭</span>
                </label>
              </div>
              {currentNodeValidationErrors?.type && (
                <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                  {currentNodeValidationErrors.type}
                </div>
              )}
            </div>

            <button style={secondaryButton} onClick={onUpdateCurrentNode}>
              저장
            </button>
          </div>

          {(depth === 1 || depth === 2) && (
            <div
              style={{
                padding: "14px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                background: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ fontWeight: 700 }}>하위 문의 유형</div>
              <button style={primaryButton} onClick={onOpenChildModal}>
                하위 문의 유형 추가
              </button>
            </div>
          )}

          {/* 하위 문의 유형 추가 팝업 */}
          {isChildModalOpen && (
            <ChildInquiryTypeModal
              newChildTitle={newChildTitle}
              onNewChildTitleChange={onNewChildTitleChange}
              newChildContent={newChildContent}
              onNewChildContentChange={onNewChildContentChange}
              newChildType={newChildType}
              onNewChildTypeChange={onNewChildTypeChange}
              onAddChild={onAddChild}
              onClose={onCloseChildModal}
              validationErrors={validationErrors}
            />
          )}
        </div>
      ) : isEmpty ? (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              padding: "14px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              background: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ fontWeight: 700 }}>최상위 문의 유형 추가</div>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              등록된 문의 유형이 없습니다. 최상위 문의 유형을 추가해주세요.
            </div>
            <input
              value={newRootLabel}
              onChange={(e) => onNewRootChange(e.target.value)}
              placeholder="추가할 최상위 문의 유형 이름"
              style={inputStyle}
            />
            <button style={primaryButton} onClick={onAddRoot}>
              최상위 문의 유형 추가
            </button>
          </div>
        </div>
      ) : (
        <EmptyState text="좌측에서 수정할 유형을 선택하세요." />
      )}
    </section>
  );
}

