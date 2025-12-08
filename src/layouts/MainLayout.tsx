import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarWidth = 240;

  const menuItems = useMemo(
    () => [
      { label: "상담 메인", path: "/agent" },
      { label: "문의유형 관리", path: "/inquiry-types" },
    ],
    []
  );

  const handleNavigate = (path?: string) => {
    if (!path) return;
    navigate(path);
    setOpen(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f6f7fb",
      }}
    >
      {/* 상단 여백 + 간단한 헤더 */}
      <header
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* 필요 시 상단 헤더 콘텐츠 영역 */}
      </header>

      {/* 본문 레이아웃 */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* 사이드바 (오버레이로 슬라이드) */}
        <aside
          style={{
            position: "fixed",
            top: "56px",
            left: 0,
            height: "calc(100vh - 56px)",
            width: `${sidebarWidth}px`,
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            padding: "16px 12px",
            boxSizing: "border-box",
            overflow: "hidden",
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 220ms ease",
            boxShadow: open ? "6px 0 18px rgba(0,0,0,0.08)" : "none",
            zIndex: 20,
            borderTopRightRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 700,
              fontSize: "16px",
              marginBottom: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <span>메뉴</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menuItems.map(({ label, path }) => {
              const isActive = path && location.pathname === path;
              return (
                <li
                  key={label}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    cursor: path ? "pointer" : "default",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "14px",
                    color: isActive ? "#2563eb" : "#111827",
                    backgroundColor: isActive ? "#e5edff" : "transparent",
                    transition: "background-color 120ms ease, color 120ms ease",
                  }}
                  onClick={() => handleNavigate(path)}
                  onMouseEnter={(e) =>
                    path
                      ? (e.currentTarget.style.backgroundColor = "#f3f4f6")
                      : undefined
                  }
                  onMouseLeave={(e) =>
                    path
                      ? (e.currentTarget.style.backgroundColor = isActive
                        ? "#e5edff"
                        : "transparent")
                      : undefined
                  }
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* 상단 고정 햄버거 토글 버튼 */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          style={{
            position: "fixed",
            top: "8px",
            left: "20px",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            border: open ? "1px solid #cbd5e1" : "1px solid #d1d5db",
            background: open ? "#e5edff" : "#fff",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: "1",
            padding: 0,
            boxShadow: open
              ? "inset 0 1px 2px rgba(0,0,0,0.04), 0 6px 14px rgba(0,0,0,0.12)"
              : "0 6px 14px rgba(0,0,0,0.12)",
            zIndex: 25,
          }}
          aria-label="toggle sidebar"
        >
          ☰
        </button>

        {/* 메인 컨텐츠 */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            padding: "0px 10px 0px",
            overflow: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
