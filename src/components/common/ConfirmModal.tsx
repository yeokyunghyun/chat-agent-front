interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Simple, self-contained confirmation modal.
 * Uses fixed positioning so it can be dropped anywhere without portals.
 */
export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "16px",
        boxSizing: "border-box",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          padding: "18px 18px 14px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ fontSize: "17px", fontWeight: 700, color: "#111" }}>{title}</div>
        {description ? (
          <div style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.5 }}>
            {description}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
            marginTop: "6px",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#374151",
              cursor: "pointer",
              minWidth: "78px",
              fontWeight: 600,
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              minWidth: "78px",
              fontWeight: 700,
              boxShadow: "0 6px 14px rgba(239,68,68,0.25)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

