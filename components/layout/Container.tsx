type Width = "apple" | "wide";

export default function Container({
  children,
  width = "apple",
  className = "",
}: {
  children: React.ReactNode;
  width?: Width;
  className?: string;
}) {
  const max = width === "wide" ? "max-w-apple-wide" : "max-w-apple";
  return (
    <div className={`mx-auto ${max} px-6 md:px-8 ${className}`}>{children}</div>
  );
}
