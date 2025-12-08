type EmptyStateProps = {
  text: string;
};

export default function EmptyState({ text }: EmptyStateProps) {
  return (
    <div
      style={{
        border: "1px dashed #d1d5db",
        borderRadius: "10px",
        padding: "14px",
        color: "#9ca3af",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}

