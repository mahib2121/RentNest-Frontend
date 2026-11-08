import { cn } from "@/lib/utils";

/**
 * A hairline-outline status chip. Statuses map onto the brand palette
 * rather than a separate set of pastel fills.
 */
const statusTone: Record<string, string> = {
  AVAILABLE: "border-status-approved/40 text-status-approved",
  APPROVED: "border-status-approved/40 text-status-approved",
  CONFIRMED: "border-status-approved/40 text-status-approved",
  ACTIVE: "border-status-approved/40 text-status-approved",
  SUCCESS: "border-status-approved/40 text-status-approved",

  PENDING: "border-status-pending/40 text-status-pending",
  RENTED: "border-status-pending/40 text-status-pending",

  REJECTED: "border-status-rejected/40 text-status-rejected",
  BANNED: "border-status-rejected/40 text-status-rejected",
  INACTIVE: "border-status-neutral/40 text-status-neutral",
  CANCELLED: "border-status-neutral/40 text-status-neutral",
};

const humanize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");

export function StatusChip({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-sm border px-1.5 font-label text-xs whitespace-nowrap",
        statusTone[status] ?? "border-line-strong text-muted-foreground",
        className
      )}
    >
      {humanize(status)}
    </span>
  );
}
