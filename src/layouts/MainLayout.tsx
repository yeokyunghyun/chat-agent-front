import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 🟦 햄버거 버튼 (화면 위에 얹힘, 공간 차지 X) */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          width: "40px",
          height: "40px",
          zIndex: 50,
          borderRadius: "8px",
          background: "white",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* 🟧 MainPage 전체 (100vw 사용) */}
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Outlet />
      </div>

      {/* 🟥 메뉴 오버레이 */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "260px",
            height: "100vh",
            background: "white",
            padding: "20px",
            boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "-50px",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "white",
              border: "1px solid #ccc",
              cursor: "pointer",
              zIndex: 120,
            }}
          >
            ✕
          </button>

          <h3>Menu</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ padding: "8px 0" }}>대시보드</li>
            <li style={{ padding: "8px 0" }}>상담 목록</li>
            <li style={{ padding: "8px 0" }}>설정</li>
          </ul>
        </div>
      )}
    </div>
  );
}
