import React from "react";

interface HeaderBarProps {
  title: string;
  rightContent?: React.ReactNode; // 오른쪽에 아무 JSX나 넣을 수 있게
}

export default function HeaderBar({ title, rightContent }: HeaderBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
      }}
    >
      <div>
        <div style={{ fontSize: "18px", fontWeight: 700 }}>{title}</div>
      </div>

      {rightContent && (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          {rightContent}
        </div>
      )}
    </div>
  );
}
