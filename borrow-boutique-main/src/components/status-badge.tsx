import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/app-store";

const map: Record<OrderStatus, { label: string; cls: string }> = {
  menunggu_pembayaran: { label: "Menunggu Pembayaran", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-300" },
  menunggu_verifikasi: { label: "Menunggu Verifikasi", cls: "bg-secondary/15 text-secondary" },
  diproses:            { label: "Diproses",            cls: "bg-primary/15 text-primary" },
  dikirim:             { label: "Dikirim",             cls: "bg-blue-500/15 text-blue-600 dark:text-blue-300" },
  dipinjam:            { label: "Dipinjam",            cls: "bg-purple-500/15 text-purple-600 dark:text-purple-300" },
  proses_pengembalian: { label: "Proses Pengembalian", cls: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300" },
  selesai:             { label: "Selesai",             cls: "bg-success/15 text-success" },
  ditolak:             { label: "Ditolak",             cls: "bg-destructive/15 text-destructive" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider", m.cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}
