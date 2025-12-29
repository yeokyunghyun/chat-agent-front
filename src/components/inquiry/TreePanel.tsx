import EmptyState from "./EmptyState";
import PanelHeader from "./PanelHeader";
import { panelStyle } from "./styles";
import type { TreeNode } from "@/types/inqry"; 

type TreePanelProps = {
  tree: TreeNode[];
  selectedId: string;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  setRenameValue: (value: string) => void;
  onAddRoot: () => void;
  onDelete: () => void;
  selectedNode: TreeNode | null;
};

export default function TreePanel({
  tree,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  setRenameValue,
  onAddRoot,
  onDelete,
  selectedNode
}: TreePanelProps) {
  return (
    <section style={{ ...panelStyle, display: "flex", flexDirection: "column" }}>
      <PanelHeader title="문의 유형 트리 (3 Depth)" />
      <div
        style={{
          marginTop: "8px",
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        {tree.length ? (
          tree.map((node) => (
            <TreeRow
              key={node.id}
              node={node}
              depth={1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              setRenameValue={setRenameValue}
            />
          ))
        ) : (
          <EmptyState text="등록된 유형이 없습니다." />
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        {/* <button
          onClick={onAddRoot}
          style={{
            flex: 1,
            padding: "10px 12px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          최상위 문의유형 추가
        </button> */}
        <button
          onClick={onDelete}
          disabled={!selectedNode}
          style={{
            flex: 1,
            padding: "10px 12px",
            background: selectedNode ? "#ef4444" : "#d1d5db",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "12px",
            cursor: selectedNode ? "pointer" : "not-allowed",
          }}
        >
          삭제하기
        </button>
      </div>
    </section>
  );
}

type TreeRowProps = {
  node: TreeNode;
  depth: number;
  selectedId: string;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  setRenameValue: (value: string) => void;
};

function TreeRow({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  setRenameValue
}: TreeRowProps) {
  const hasChildren = !!node.children?.length;
  const expanded = expandedIds.has(node.id);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 6px",
          borderRadius: "8px",
          cursor: "pointer",
          background: selectedId === node.id ? "#eef2ff" : "transparent",
          color: selectedId === node.id ? "#4338ca" : "#111827",
          marginLeft: `${(depth - 1) * 14}px`,
          transition: "background-color 120ms ease, color 120ms ease",
        }}
        onClick={() => {
          console.log("???????????????", node);
          console.log('>>> expandedIds >>>', expandedIds);
          
          onSelect(node.id);
          setRenameValue(node.title);
          
        }}
        onMouseEnter={(e) => {
          if (selectedId !== node.id) {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }
        }}
        onMouseLeave={(e) => {
          if (selectedId !== node.id) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              console.log("onClick@@@", node.id);
              e.stopPropagation();
              onToggle(node.id);
            }}
            style={{
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              background: "#fff",
              cursor: "pointer",
            }}
            aria-label="toggle children"
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span style={{ width: "22px" }} />
        )}
        <div style={{ fontWeight: 600, fontSize: "14px" }}>{node.title}</div>
      </div>

      {hasChildren && expanded && (
        <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {node.children!.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              setRenameValue={setRenameValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

