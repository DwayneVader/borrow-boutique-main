import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { stores, formatIDR } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { NotStoreOwner } from "./toko.index";
import { Wallet, TrendingUp } from "lucide-react";

const COMMISSION = 0.1;

export const Route = createFileRoute("/_app/toko/riwayat")({
  component: RiwayatToko,
});

function RiwayatToko() {
  const { user, orders, books } = useApp();
  if (!user?.isStoreOwner) return <NotStoreOwner />;
  const store = stores.find((s) => s.id === user.storeId)!;
  const all = orders.filter((o) => o.storeId === store.id);
  const done = all.filter((o) => o.status === "selesai");
  const gross = done.reduce((a, o) => a + o.rentTotal, 0);
  const fines = done.reduce((a, o) => a + (o.fine || 0), 0);
  const net = Math.round(gross * (1 - COMMISSION)) + fines;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Riwayat & Pendapatan</h1>
        <p className="text-sm text-muted-foreground mt-1">Laporan transaksi & saldo siap cair.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card icon={<TrendingUp className="h-4 w-4" />} label="Pendapatan kotor" value={formatIDR(gross)} />
        <Card icon={<Wallet className="h-4 w-4" />} label={`Komisi platform (${COMMISSION * 100}%)`} value={"-" + formatIDR(Math.round(gross * COMMISSION))} />
        <Card icon={<Wallet className="h-4 w-4" />} label="Siap dicairkan" value={formatIDR(net)} highlight />
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border/50 font-serif">Semua Transaksi</div>
        {all.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Belum ada transaksi.</div>
        ) : (
          <div className="divide-y divide-border/40">
            {all.map((o) => {
              const b = books.find((x) => x.id === o.bookId)!;
              return (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3">
                  <img src={b.cover} className="h-10 w-8 object-cover rounded" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{b.title}</div>
                    <div className="text-xs text-muted-foreground">#{o.id.slice(-8)} · {o.durationDays} hari</div>
                  </div>
                  <div className="text-sm text-primary font-medium">{formatIDR(o.rentTotal)}</div>
                  <StatusBadge status={o.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-5 ${highlight ? "border-primary/50 bg-primary/5" : ""}`}>
      <div className="text-xs uppercase text-muted-foreground inline-flex items-center gap-1.5">{icon}{label}</div>
      <div className={`font-serif text-2xl mt-1 ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
