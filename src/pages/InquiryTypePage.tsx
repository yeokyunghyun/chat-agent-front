import { useEffect, useMemo, useState } from "react";
import EditorPanel from "../components/inquiry/EditorPanel";
import PreviewPanel from "../components/inquiry/PreviewPanel";
import TreePanel from "../components/inquiry/TreePanel";
import type { TreeNode } from "@/types/inqry";
import HeaderBar from "@/components/common/HeaderBar";

export default function InquiryTypePage() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState<string>("");

  const [newChildLabel, setNewChildLabel] = useState("새 하위 문의 유형");
  const [newRootLabel, setNewRootLabel] = useState("새 최상위 문의 유형");
  const [renameValue, setRenameValue] = useState<string>("");

  const loadTree = async () => {
    const res = await fetch("/api/select/inquiryTypeTree");
    const data: TreeNode[] = await res.json();

    setTree(data);
    
    setExpandedIds(new Set(data.map((n) => n.id)));

    if (data.length > 0) {
      setSelectedId(data[0].id);
    } else {
      setSelectedId("");
    }
  };

  useEffect(() => {
    loadTree();
  }, []);

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

  const addChildToNode = async () => {
    console.log('>>> addChildToNode');
    console.log('>>> newChildLabel.trim() >>>', newChildLabel.trim());
    
    if (!selectedNode || path.length !== 1 || !newChildLabel.trim()) {
      alert("문의유형 이름을 입력해주세요.");
      return;
    }

    try {
      
      const res = await fetch("/api/insert/inquiryType", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: selectedNode.id,
          title: newChildLabel.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("문의 유형 추가에 실패했습니다.");
      }

      setNewChildLabel("새 하위 문의 유형");
      await loadTree();
      
      if (selectedNode) {
        setExpandedIds((prev) => new Set([...prev, selectedNode.id]));
      }
    } catch (error) {
      console.error("Error adding child node:", error);
      alert("문의 유형 추가 중 오류가 발생했습니다.");
    }
  };

  const addRootNode = async () => {
    console.log('>>> addRootNode');
    console.log('>>> newRootLabel >>>', newRootLabel.trim());
    
    if (!newRootLabel.trim()) {
      alert("문의유형 이름을 입력해주세요.");
      return;
    }
    
    try {
      const res = await fetch("/api/insert/inquiryType", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: null,
          title: newRootLabel.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("최상위 문의 유형 추가에 실패했습니다.");
      }

      setNewRootLabel("새 최상위 문의 유형");
      await loadTree();
    } catch (error) {
      console.error("Error adding root node:", error);
      alert("최상위 문의 유형 추가 중 오류가 발생했습니다.");
    }
  };

  const renameSelected = async () => {
    if (!selectedNode || !renameValue.trim()) return;
    
      const res = await fetch("/api/update/inquiryTypeName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedNode.id,
          title: renameValue,
        }),
      });

      if (!res.ok) {
        throw new Error("이름 변경에 실패하셨습니다.");
      }

    await loadTree();
    setRenameValue("");
  };

  const depth = path.length;
  const currentTitle = path.map((n) => n.title).join(" / ");

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
        // rightContent={
        //   selectedNode && (
        //     <div
        //       style={{
        //         display: "inline-flex",
        //         alignItems: "center",
        //         gap: "6px",
        //         padding: "8px 10px",
        //         background: "#eef2ff",
        //         borderRadius: "10px",
        //         color: "#4338ca",
        //         fontWeight: 600,
        //         fontSize: "13px",
        //       }}
        //     >
        //       현재 선택: {currentTitle}
        //     </div>
        //   )
        // }
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
            setRenameValue={setRenameValue}
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
            newRootLabel={newRootLabel}
            onNewRootChange={setNewRootLabel}
            onAddRoot={addRootNode}
            isEmpty={tree.length === 0}
          />
        </div>
      </div>
    </div>
  );
}

function addChild(node: TreeNode, targetId: string, title: string): TreeNode {
  if (node.id === targetId) {
    const nextChild: TreeNode = {
      id: `${node.id}-${(node.children?.length || 0) + 1}`,
      title,
    };
    return {
      ...node,
      children: [...(node.children || []), nextChild],
    };
  }
  if (!node.children) return node;
  return {
    ...node,
    children: node.children.map((child) => addChild(child, targetId, title)),
  };
}

function renameNode(node: TreeNode, targetId: string, title: string): TreeNode {
  if (node.id === targetId) return { ...node, title };
  if (!node.children) return node;
  return {
    ...node,
    children: node.children.map((child) => renameNode(child, targetId, title)),
  };
}
