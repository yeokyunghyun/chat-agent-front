import { useMemo, useState } from "react";
import EditorPanel from "../components/inquiry/EditorPanel";
import PreviewPanel from "../components/inquiry/PreviewPanel";
import TreePanel from "../components/inquiry/TreePanel";
import type { TreeNode } from "../components/inquiry/types";
import HeaderBar from "@/components/common/HeaderBar";

const initialTree: TreeNode[] = [
  {
    id: "type-order",
    label: "주문/결제",
    children: [
      {
        id: "type-order-payment",
        label: "결제 오류",
        children: [
          { id: "type-order-payment-card", label: "카드 결제 실패" },
          { id: "type-order-payment-transfer", label: "계좌 이체 지연" },
        ],
      },
      {
        id: "type-order-receipt",
        label: "영수증/세금계산서",
        children: [
          { id: "type-order-receipt-issue", label: "발급 요청" },
          { id: "type-order-receipt-modify", label: "정보 수정" },
        ],
      },
    ],
  },
  {
    id: "type-shipping",
    label: "배송",
    children: [
      {
        id: "type-shipping-delay",
        label: "지연/미도착",
        children: [
          { id: "type-shipping-delay-track", label: "배송 추적 안 됨" },
          { id: "type-shipping-delay-long", label: "예상일 초과" },
        ],
      },
      {
        id: "type-shipping-change",
        label: "주소 변경",
        children: [{ id: "type-shipping-change-request", label: "변경 요청" }],
      },
    ],
  },
  {
    id: "type-refund",
    label: "취소/환불",
    children: [
      {
        id: "type-refund-progress",
        label: "진행 상황 문의",
        children: [
          { id: "type-refund-progress-status", label: "환불 상태" },
          { id: "type-refund-progress-term", label: "소요 기간" },
        ],
      },
    ],
  },
];

export default function InquiryTypePage() {
  const [tree, setTree] = useState<TreeNode[]>(initialTree);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initialTree.map((node) => node.id))
  );
  const [selectedId, setSelectedId] = useState<string>(initialTree[0].id);
  const [newChildLabel, setNewChildLabel] = useState("새 하위 문의 유형");
  const [renameValue, setRenameValue] = useState("");

  const { selectedNode, path } = useMemo(() => {
    const findNode = (
      nodes: TreeNode[],
      targetId: string,
      currentPath: TreeNode[] = []
    ): { selectedNode: TreeNode | null; path: TreeNode[] } => {
      for (const node of nodes) {
        const nextPath = [...currentPath, node];
        if (node.id === targetId) return { selectedNode: node, path: nextPath };
        if (node.children) {
          const found = findNode(node.children, targetId, nextPath);
          if (found.selectedNode) return found;
        }
      }
      return { selectedNode: null, path: [] };
    };
    return findNode(tree, selectedId);
  }, [selectedId, tree]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addChildToNode = () => {
    if (!selectedNode || path.length !== 1 || !newChildLabel.trim()) return;
    const targetId = selectedNode.id;
    const updated = tree.map((node) => addChild(node, targetId, newChildLabel));
    setTree(updated);
    setNewChildLabel("새 하위 문의 유형");
    setExpandedIds((prev) => new Set([...prev, targetId]));
  };

  const renameSelected = () => {
    if (!selectedNode || !renameValue.trim()) return;
    const updated = tree.map((node) => renameNode(node, selectedId, renameValue));
    setTree(updated);
    setRenameValue("");
  };

  const depth = path.length;
  const currentTitle = path.map((n) => n.label).join(" / ");

  return (
    <div
      style={{
        height: "100%",
        padding: "18px 6px 18px 6px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          height: "100%",
        }}
      >
      <HeaderBar
        title="문의 유형 관리"
        rightContent={
          selectedNode && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 10px",
                background: "#eef2ff",
                borderRadius: "10px",
                color: "#4338ca",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              현재 선택: {currentTitle}
            </div>
          )
        }
      />


        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "320px 1fr 360px",
            gap: "12px",
          }}
        >
          <TreePanel
            tree={tree}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={setSelectedId}
            onToggle={toggleExpand}
          />
          <PreviewPanel selectedNode={selectedNode} depth={depth} currentTitle={currentTitle} />
          <EditorPanel
            selectedNode={selectedNode}
            depth={depth}
            currentTitle={currentTitle}
            renameValue={renameValue}
            onRenameChange={setRenameValue}
            onRenameSubmit={renameSelected}
            newChildLabel={newChildLabel}
            onNewChildChange={setNewChildLabel}
            onAddChild={addChildToNode}
          />
        </div>
      </div>
    </div>
  );
}

function addChild(node: TreeNode, targetId: string, label: string): TreeNode {
  if (node.id === targetId) {
    const nextChild: TreeNode = {
      id: `${node.id}-${(node.children?.length || 0) + 1}`,
      label,
    };
    return {
      ...node,
      children: [...(node.children || []), nextChild],
    };
  }
  if (!node.children) return node;
  return {
    ...node,
    children: node.children.map((child) => addChild(child, targetId, label)),
  };
}

function renameNode(node: TreeNode, targetId: string, label: string): TreeNode {
  if (node.id === targetId) return { ...node, label };
  if (!node.children) return node;
  return {
    ...node,
    children: node.children.map((child) => renameNode(child, targetId, label)),
  };
}
