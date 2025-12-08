type PanelHeaderProps = {
  title: string;
};

export default function PanelHeader({ title }: PanelHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "15px" }}>{title}</div>
    </div>
  );
}

