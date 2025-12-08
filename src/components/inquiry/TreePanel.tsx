import EmptyState from "./EmptyState";
import PanelHeader from "./PanelHeader";
import { panelStyle } from "./styles";
import type { TreeNode } from "./types";

type TreePanelProps = {
  tree: TreeNode[];
  selectedId: string;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
};

export default function TreePanel({
  tree,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: TreePanelProps) {
  return (
    <section style={panelStyle}>
      <PanelHeader title="문의 유형 트리 (3 Depth)" />
      <div
        style={{
          marginTop: "8px",
          overflow: "auto",
          height: "100%",
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
            />
          ))
        ) : (
          <EmptyState text="등록된 유형이 없습니다." />
        )}
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
};

function TreeRow({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
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
        onClick={() => onSelect(node.id)}
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
        <div style={{ fontWeight: 600, fontSize: "14px" }}>{node.label}</div>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

