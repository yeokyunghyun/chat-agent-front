import type { CSSProperties } from "react";

export const panelStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "12px",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.05)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
  minHeight: 0,
  overflow: "hidden",
};

export const inputStyle: CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  outline: "none",
};

export const primaryButton: CSSProperties = {
  padding: "10px 14px",
  background: "#4338ca",
  color: "#fff",
  border: "1px solid #4338ca",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
};

export const secondaryButton: CSSProperties = {
  padding: "10px 14px",
  background: "#eef2ff",
  color: "#4338ca",
  border: "1px solid #c7d2fe",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
};

