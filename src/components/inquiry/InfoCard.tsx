type InfoCardProps = {
  label: string;
  value: string;
};

export default function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div style={{ color: "#6b7280", fontSize: "13px" }}>{label}</div>
      <div style={{ marginTop: "4px", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

