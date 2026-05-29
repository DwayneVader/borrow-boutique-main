import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { formatIDR } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/riwayat")({
  component: RiwayatPage,
});

function RiwayatPage() {
  const { user, orders, books } = useApp();
  
  if (!user) return (
    <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto mt-12">
      <h2 className="font-serif text-2xl">Riwayat peminjaman kamu</h2>
      <Link to="/login" className="mt-5 inline-block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Masuk</Link>
    </div>
  );

  // Murni menyaring pesanan yang statusnya selesai atau ditolak saja
  const my = orders.filter((o) => o.userId === user.id && (o.status === "selesai" || o.status === "ditolak"));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl">Riwayat Peminjaman</h1>
          <p className="text-sm text-muted-foreground mt-1">Daftar transaksi pinjam buku kamu yang sudah selesai.</p>
        </div>
        <Link to="/transaksi" className="text-sm text-primary hover:underline">← Lihat transaksi aktif</Link>
      </div>
      
      {my.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Belum ada riwayat selesai.</div>
      ) : (
        <div className="space-y-3">
          {my.map((o) => {
            const b = books.find((x) => x.id === o.bookId);
            if (!b) return null;
            return (
              <div key={o.id} className="glass rounded-2xl p-4 flex gap-4">
                <img src={b.cover} alt={b.title} className="h-20 w-16 object-cover rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <div className="font-serif text-base">{b.title}</div>
                      <div className="text-xs text-muted-foreground">#{o.id.slice(-8)} · {o.durationDays} hari</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-3">
                    <span>Total: {formatIDR(o.total)}</span>
                    {o.refunded !== undefined && <span>Deposito kembali: {formatIDR(o.refunded)}</span>}
                    {o.fine ? <span className="text-destructive">Denda: {formatIDR(o.fine)}</span> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}