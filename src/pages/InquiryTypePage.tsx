import { useEffect, useMemo, useState } from "react";
import EditorPanel from "../components/inquiry/EditorPanel";
import PreviewPanel from "../components/inquiry/PreviewPanel";
import TreePanel from "../components/inquiry/TreePanel";
import type { TreeNode } from "@/types/inqry";
import HeaderBar from "@/components/common/HeaderBar";
import { apiFetch } from "@/utils/api";

export default function InquiryTypePage() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState<string>("");

  const [newChildTitle, setNewChildTitle] = useState("");
  const [newChildContent, setNewChildContent] = useState("");
  const [newChildType, setNewChildType] = useState("block");
  const [newRootLabel, setNewRootLabel] = useState("새 최상위 문의 유형");
  const [renameValue, setRenameValue] = useState<string>("");
  const [deleteValue, setDeleteValue] = useState<boolean>(false);
  const [currentNodeTitle, setCurrentNodeTitle] = useState("");
  const [currentNodeContent, setCurrentNodeContent] = useState("");
  const [currentNodeType, setCurrentNodeType] = useState("block");
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    content?: string;
    type?: string;
  }>({});
  const [currentNodeValidationErrors, setCurrentNodeValidationErrors] = useState<{
    title?: string;
    content?: string;
    type?: string;
  }>({});
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const loadTree = async () => {
    const res = await apiFetch("/api/select/inquiryTypeTree");
    const data: TreeNode[] = await res.json();

    setTree(data);
    
    // setExpandedIds(new Set(data.map((n) => n.id)));

    // if (data.length > 0) {
    //   setSelectedId(data[0].id);
    // } else {
    //   setSelectedId("");
    // }
  };

  useEffect(() => {
    const init = async () => {
      await loadTree();
    };
    init();
    
    if (tree.length > 0) {
      setSelectedId(tree[0].id);
    } else {
      setSelectedId("");
    }
    
  }, []);

  useEffect(() => {
    loadTree();
    if (tree.length > 0) {
      setSelectedId(tree[0].id);
    } else {
      setSelectedId("");
    }
  }, [deleteValue])

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

  // selectedNode가 변경될 때 input, textarea, radio에 값 채우기
  useEffect(() => {
    if (selectedNode) {
      // 자기 자신 노드 수정용 값 세팅
      setCurrentNodeTitle(selectedNode.title || "");
      setCurrentNodeContent(selectedNode.content || "");
      // DB에서 오는 type 값(block/counseling)을 그대로 세팅
      setCurrentNodeType(selectedNode.type || "block");
      
      // 하위 문의 유형 추가용 초기값 세팅
      setNewChildTitle("");
      setNewChildContent("");
      setNewChildType("block");
    }
  }, [selectedNode]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addChildToNode = async () => {
    if (!selectedNode) {
      return;
    }

    // Validation
    const errors: {
      title?: string;
      content?: string;
      type?: string;
    } = {};

    if (!newChildTitle.trim()) {
      errors.title = "제목을 입력해주세요.";
    }
    if (!newChildContent.trim()) {
      errors.content = "내용을 입력해주세요.";
    }
    if (!newChildType) {
      errors.type = "유형을 선택해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    try {
      const res = await apiFetch("/api/insert/inquiryType", {
        method: "POST",
        body: JSON.stringify({
          parentId: selectedNode.id,
          title: newChildTitle.trim(),
          content: newChildContent.trim(),
          type: newChildType,
        }),
      });

      if (!res.ok) {
        throw new Error("문의 유형 추가에 실패했습니다.");
      }

      setNewChildTitle("");
      setNewChildContent("");
      setNewChildType("block");
      setValidationErrors({});
      setIsChildModalOpen(false);
      await loadTree();
      alert("문의 유형이 추가되었습니다.");
      if (selectedNode) {
        setExpandedIds((prev) => new Set([...prev, selectedNode.id]));
      }
    } catch (error) {
      console.error("Error adding child node:", error);
      alert("문의 유형 추가 중 오류가 발생했습니다.");
    }
  };

  const updateCurrentNode = async () => {
    if (!selectedNode) return;

    // Validation
    const errors: {
      title?: string;
      content?: string;
      type?: string;
    } = {};

    if (!currentNodeTitle.trim()) {
      errors.title = "제목을 입력해주세요.";
    }
    if (!currentNodeContent.trim()) {
      errors.content = "내용을 입력해주세요.";
    }
    if (!currentNodeType) {
      errors.type = "유형을 선택해주세요.";
    }

    if (Object.keys(errors).length > 0) {
      setCurrentNodeValidationErrors(errors);
      return;
    }

    setCurrentNodeValidationErrors({});

    try {
      const res = await apiFetch("/api/update/inquiryType", {
        method: "POST",
        body: JSON.stringify({
          id: selectedNode.id,
          title: currentNodeTitle.trim(),
          content: currentNodeContent.trim(),
          type: currentNodeType,
        }),
      });

      if (!res.ok) {
        throw new Error("업데이트에 실패했습니다.");
      }

      await loadTree();
      alert("문의 유형이 수정되었습니다.");
    } catch (error) {
      console.error("Error updating node:", error);
      alert("문의 유형 수정 중 오류가 발생했습니다.");
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
      const res = await apiFetch("/api/insert/inquiryType", {
        method: "POST",
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
    
      const res = await apiFetch("/api/update/inquiryTypeName", {
        method: "POST",
        body: JSON.stringify({
          id: selectedNode.id,
          title: renameValue,
        }),
      });

      if (!res.ok) {
        throw new Error("이름 변경에 실패하셨습니다.");
      }

    alert("이름 변경에 성공하셨습니다 !");
    await loadTree();
  };

  const deleteSelected = async () => {
    if (!selectedNode) return;

    const hasChildren = selectedNode.children && selectedNode.children.length > 0;
    
    if (hasChildren) {
      const confirmed = window.confirm(
        `"${selectedNode.title}"에 하위 문의유형이 있습니다. 정말 삭제하시겠습니까?\n하위 문의유형도 함께 삭제됩니다.`
      );
      if (!confirmed) return;
    }

    else {
      const confirmed = window.confirm(
        "해당 문의유형을 삭제하시겠습니까?"
      );
      if (!confirmed) return;
    }

    try {
      const res = await apiFetch("/api/delete/inquiryType", {
        method: "POST",
        body: JSON.stringify({
          id: selectedNode.id,
        }),
      });

      if (!res.ok) {
        throw new Error("삭제에 실패했습니다.");
      }

      setSelectedId("");
      
      setDeleteValue(!deleteValue);
    } catch (error) {
      console.error("Error deleting node:", error);
      alert("문의 유형 삭제 중 오류가 발생했습니다.");
    }
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
            onAddRoot={addRootNode}
            onDelete={deleteSelected}
            selectedNode={selectedNode}
          />
          <PreviewPanel 
            selectedNode={selectedNode} 
            depth={depth} 
            currentTitle={currentTitle} 
            currentNodeType={currentNodeType}
            onSelect={setSelectedId}
            setExpandedIds={setExpandedIds}
          />
          <EditorPanel
            selectedNode={selectedNode}
            depth={depth}
            currentTitle={currentTitle}
            currentNodeTitle={currentNodeTitle}
            onCurrentNodeTitleChange={setCurrentNodeTitle}
            currentNodeContent={currentNodeContent}
            onCurrentNodeContentChange={setCurrentNodeContent}
            currentNodeType={currentNodeType}
            onCurrentNodeTypeChange={setCurrentNodeType}
            onUpdateCurrentNode={updateCurrentNode}
            newChildTitle={newChildTitle}
            onNewChildTitleChange={setNewChildTitle}
            newChildContent={newChildContent}
            onNewChildContentChange={setNewChildContent}
            newChildType={newChildType}
            onNewChildTypeChange={setNewChildType}
            onAddChild={addChildToNode}
            newRootLabel={newRootLabel}
            onNewRootChange={setNewRootLabel}
            onAddRoot={addRootNode}
            isEmpty={tree.length === 0}
            validationErrors={validationErrors}
            currentNodeValidationErrors={currentNodeValidationErrors}
            isChildModalOpen={isChildModalOpen}
            onOpenChildModal={() => setIsChildModalOpen(true)}
            onCloseChildModal={() => setIsChildModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

