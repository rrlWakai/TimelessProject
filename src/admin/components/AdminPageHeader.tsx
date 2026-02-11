export default function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs tracking-[0.25em] text-black/50">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-black/60">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
