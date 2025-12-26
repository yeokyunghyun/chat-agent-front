import EmptyState from "./EmptyState";
import PanelHeader from "./PanelHeader";
import { inputStyle, panelStyle, primaryButton, secondaryButton } from "./styles";
import type { TreeNode } from "@/types/inqry";

type EditorPanelProps = {
  selectedNode: TreeNode | null;
  depth: number;
  currentTitle: string;
  renameValue: string;
  onRenameChange: (value: string) => void;
  onRenameSubmit: () => void;
  newChildLabel: string;
  onNewChildChange: (value: string) => void;
  onAddChild: () => void;
  newRootLabel: string;
  onNewRootChange: (value: string) => void;
  onAddRoot: () => void;
  isEmpty: boolean;
};

export default function EditorPanel({
  selectedNode,
  depth,
  currentTitle,
  renameValue,
  onRenameChange,
  onRenameSubmit,
  newChildLabel,
  onNewChildChange,
  onAddChild,
  newRootLabel,
  onNewRootChange,
  onAddRoot,
  isEmpty,
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
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6b7280" }}>선택된 항목</div>
            <div style={{ fontWeight: 700, marginTop: "4px" }}>{currentTitle}</div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              placeholder="이름 변경"
              style={inputStyle}
            />
            <button style={primaryButton} onClick={onRenameSubmit}>
              이름 저장
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
              <div style={{ fontWeight: 700 }}>하위 버튼 추가</div>
              <input
                value={newChildLabel}
                onChange={(e) => onNewChildChange(e.target.value)}
                placeholder="추가할 버튼 이름"
                style={inputStyle}
              />
              <button style={secondaryButton} onClick={onAddChild}>
                버튼 추가
              </button>
            </div>
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

