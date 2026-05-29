import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp, type Order, type OrderStatus } from "@/lib/app-store";
import { formatIDR, couriers } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package } from "lucide-react";

export const Route = createFileRoute("/_app/transaksi")({
  component: TransaksiPage,
});

function TransaksiPage() {
  const { user, orders, books, updateOrder } = useApp();
  const [returning, setReturning] = useState<Order | null>(null);

  if (!user) {
    return (
      <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto mt-12">
        <h2 className="font-serif text-2xl">Lihat transaksi aktif kamu</h2>
        <Link to="/login" className="mt-5 inline-block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Masuk</Link>
      </div>
    );
  }

  // Menyaring transaksi yang masih AKTIF saja (belum selesai / belum ditolak)
  const myOrders = orders.filter((o) => o.userId === user.id && o.status !== "selesai" && o.status !== "ditolak");

  const actionMap: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
    dipinjam: { label: "Kembalikan Buku", next: "proses_pengembalian" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl">Transaksi</h1>
          <p className="text-sm text-muted-foreground mt-1">Pantau pesanan aktif kamu di sini.</p>
        </div>
        <Link to="/riwayat" className="text-sm text-primary hover:underline">Lihat riwayat →</Link>
      </div>

      {myOrders.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          Belum ada transaksi aktif. <Link to="/koleksi" className="text-primary hover:underline">Mulai sewa buku</Link>.
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => {
            const b = books.find((x) => x.id === o.bookId);
            if (!b) return null;
            const action = actionMap[o.status];
            return (
              <div key={o.id} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                <img src={b.cover} alt={b.title} className="h-24 w-20 object-cover rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-serif text-lg">{b.title}</div>
                      <div className="text-xs text-muted-foreground">#{o.id.slice(-8)} · {o.durationDays} hari · {o.courier}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Total:</span> <span className="font-medium">{formatIDR(o.total)}</span></div>
                    <div><span className="text-muted-foreground">Deposito:</span> <span className="font-medium">{formatIDR(o.deposit)}</span></div>
                    <div><span className="text-muted-foreground">Mulai:</span> <span className="font-medium">{o.startDate || "-"}</span></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {o.status === "menunggu_pembayaran" && (
                      <Button size="sm" className="rounded-xl" onClick={() => { updateOrder(o.id, { status: "menunggu_verifikasi" }); toast.success("Konfirmasi terkirim! Menunggu verifikasi toko."); }}>
                        Saya sudah bayar
                      </Button>
                    )}
                    {action && (
                      <Button size="sm" className="rounded-xl" onClick={() => setReturning(o)}>
                        <Package className="h-3.5 w-3.5 mr-1" /> {action.label}
                      </Button>
                    )}
                    {o.status === "dikirim" && (
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { updateOrder(o.id, { status: "dipinjam", startDate: new Date().toISOString().slice(0, 10) }); toast.success("Status: Sedang dipinjam"); }}>
                        Buku sudah saya terima
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!returning} onOpenChange={(v) => !v && setReturning(null)}>
        <DialogContent className="glass-strong border-0 rounded-3xl sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Form Pengembalian Buku</DialogTitle></DialogHeader>
          <ReturnForm
            order={returning}
            onDone={() => setReturning(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReturnForm({ order, onDone }: { order: Order | null; onDone: () => void }) {
  const { updateOrder } = useApp();
  const [courier, setCourier] = useState(couriers[0]?.name || "J&T");
  const [tracking, setTracking] = useState("");
  const [proof, setProof] = useState<string | null>(null);

  if (!order) return null;

  const submit = () => {
    if (!tracking) return toast.error("Masukkan nomor resi");
    if (!proof) return toast.error("Upload bukti pengiriman balik");
    updateOrder(order.id, { status: "proses_pengembalian", returnCourier: courier, trackingReturn: tracking, returnProof: proof });
    toast.success("Pengembalian dikirim ke toko untuk verifikasi");
    onDone();
  };

  return (
    <div className="space-y-3 text-sm">
      <p className="text-xs text-muted-foreground">Ongkos kirim balik ditanggung penyewa. Toko punya waktu 3×24 jam memverifikasi; lewat dari itu deposito otomatis dicairkan.</p>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Ekspedisi</label>
        <select value={courier} onChange={(e) => setCourier(e.target.value)} className="mt-1 w-full rounded-xl bg-background/60 border border-border px-3 py-2">
          {couriers.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Nomor Resi</label>
        <input value={tracking} onChange={(e) => setTracking(e.target.value)} className="mt-1 w-full rounded-xl bg-background/60 border border-border px-3 py-2" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Bukti pengiriman</label>
        <label className="mt-1 block rounded-xl border-2 border-dashed border-border p-4 text-center cursor-pointer text-xs text-muted-foreground">
          <input type="file" accept="image/*" hidden onChange={(e) => {
            const f = e.target.files?.[0]; if (!f) return;
            const r = new FileReader();
            r.onload = () => setProof(String(r.result));
            r.readAsDataURL(f);
          }} />
          {proof ? "✓ Bukti terunggah" : "Klik untuk unggah"}
        </label>
      </div>
      <Button onClick={submit} className="w-full rounded-xl mt-2">Kirim Pengembalian</Button>
    </div>
  );
}