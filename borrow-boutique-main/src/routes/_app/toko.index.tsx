import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { stores, formatIDR } from "@/lib/mock-data";
import { BookOpen, Wallet, Package, TrendingUp, Clock } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/toko/")({
  component: StoreDashboard,
});

function StoreDashboard() {
  const { user, orders, books } = useApp();
  if (!user?.isStoreOwner) return <NotStoreOwner />;
  const store = stores.find((s) => s.id === user.storeId)!;
  const storeOrders = orders.filter((o) => o.storeId === store.id);
  const revenue = storeOrders.filter((o) => o.status === "selesai").reduce((a, o) => a + o.rentTotal, 0);
  const pending = storeOrders.filter((o) => o.status === "menunggu_verifikasi").length;
  const returnPending = storeOrders.filter((o) => o.status === "proses_pengembalian").length;
  const myBooks = books.filter((b) => b.storeId === store.id).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Dashboard Toko</h1>
        <p className="text-sm text-muted-foreground mt-1">Selamat datang, {store.name}.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<BookOpen className="h-4 w-4" />} label="Buku" value={myBooks.toString()} />
        <Stat icon={<Clock className="h-4 w-4" />} label="Verifikasi pesanan" value={pending.toString()} accent />
        <Stat icon={<Package className="h-4 w-4" />} label="Verifikasi pengembalian" value={returnPending.toString()} accent />
        <Stat icon={<Wallet className="h-4 w-4" />} label="Pendapatan" value={formatIDR(revenue)} />
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl">Aktivitas terbaru</h2>
          <Link to="/toko/riwayat" className="text-xs text-primary hover:underline">Semua →</Link>
        </div>
        {storeOrders.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">Belum ada transaksi.</div>
        ) : (
          <div className="space-y-2">
            {storeOrders.slice(0, 5).map((o) => {
              const b = books.find((x) => x.id === o.bookId)!;
              return (
                <div key={o.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-foreground/5">
                  <img src={b.cover} className="h-10 w-8 object-cover rounded" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{b.title}</div>
                    <div className="text-xs text-muted-foreground">#{o.id.slice(-6)}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/toko/upload" className="glass book-card rounded-2xl p-5">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div className="font-serif text-lg mt-2">Upload buku baru</div>
          <div className="text-xs text-muted-foreground mt-1">Tambahkan koleksi yang siap disewakan.</div>
        </Link>
        <Link to="/toko/verifikasi" className="glass book-card rounded-2xl p-5">
          <Clock className="h-5 w-5 text-primary" />
          <div className="font-serif text-lg mt-2">Verifikasi pesanan</div>
          <div className="text-xs text-muted-foreground mt-1">Cek bukti transfer dari penyewa.</div>
        </Link>
        <Link to="/toko/pengembalian" className="glass book-card rounded-2xl p-5">
          <Package className="h-5 w-5 text-primary" />
          <div className="font-serif text-lg mt-2">Verifikasi pengembalian</div>
          <div className="text-xs text-muted-foreground mt-1">Cek kondisi buku & cairkan deposito.</div>
        </Link>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-5 ${accent ? "border-primary/40" : ""}`}>
      <div className="text-xs uppercase text-muted-foreground inline-flex items-center gap-1.5">{icon}{label}</div>
      <div className="font-serif text-2xl mt-1">{value}</div>
    </div>
  );
}

export function NotStoreOwner() {
  return (
    <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto mt-12">
      <h2 className="font-serif text-2xl">Khusus pemilik toko</h2>
      <p className="text-sm text-muted-foreground mt-2">Bagian ini hanya bisa diakses oleh akun pemilik toko.</p>
      <Link to="/register" search={{ store: true }} className="mt-5 inline-block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Daftar sebagai Toko</Link>
    </div>
  );
}
