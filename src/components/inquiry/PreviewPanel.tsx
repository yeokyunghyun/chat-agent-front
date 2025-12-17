import EmptyState from "./EmptyState";
import InfoCard from "./InfoCard";
import PanelHeader from "./PanelHeader";
import { panelStyle } from "./styles";
import type { TreeNode } from "./types";

type PreviewPanelProps = {
  selectedNode: TreeNode | null;
  depth: number;
  currentTitle: string;
};

export default function PreviewPanel({ selectedNode, depth, currentTitle }: PreviewPanelProps) {
  const quickActions = selectedNode?.children ?? [];

  return (
    <section style={panelStyle}>
      {/* <PanelHeader title="선택한 유형 미리보기" /> */}
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
          minHeight: 0,
        }}
      >
        {selectedNode ? (
          <>
            <InfoCard label="이름" value={selectedNode.title} />
            <InfoCard label="Depth" value={`${depth} Depth`} />
            <InfoCard label="전체 경로" value={currentTitle} />
            
            <div
              style={{
                marginTop: "30px",
                border: "1px dashed #d1d5db",
                borderRadius: "12px",
                padding: "16px",
                background: "#f9fafb",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >

              <div
                style={{
                  minHeight: "140px",
                  borderRadius: "10px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                {selectedNode.title} 화면입니다. 안내 문구나 상세 내용을 여기에 표시하세요.
              </div>
              <div>
                {quickActions.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {quickActions.map((child) => (
                      <button
                        key={child.id}
                        style={{
                          padding: "12px 10px",
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                          background: "#eef2ff",
                          color: "#4338ca",
                          fontWeight: 700,
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        {child.title}
                      </button>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="하위 퀵버튼이 없습니다. 좌측에서 유형을 선택하거나 추가하세요." />
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyState text="좌측에서 유형을 선택해 주세요." />
        )}
      </div>
    </section>
  );
}

