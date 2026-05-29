import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp, type Order } from "@/lib/app-store";
import { stores, formatIDR, type Book } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { NotStoreOwner } from "./toko.index";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_app/toko/verifikasi")({
  component: VerifikasiPesanan,
});

function VerifikasiPesanan() {
  const { user, orders, books, updateOrder } = useApp();
  if (!user?.isStoreOwner) return <NotStoreOwner />;
  const store = stores.find((s) => s.id === user.storeId)!;
  const list = orders.filter((o) => o.storeId === store.id && o.status === "menunggu_verifikasi");
  const processing = orders.filter((o) => o.storeId === store.id && o.status === "diproses");

  const approve = (id: string) => { updateOrder(id, { status: "diproses" }); toast.success("Pembayaran diverifikasi"); };
  const reject = (id: string) => { updateOrder(id, { status: "ditolak" }); toast.success("Pesanan ditolak"); };
  const ship = (id: string) => {
    const t = prompt("Masukkan nomor resi:"); if (!t) return;
    updateOrder(id, { status: "dikirim", trackingForward: t });
    toast.success("Buku dikirim");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Verifikasi Pesanan</h1>
        <p className="text-sm text-muted-foreground mt-1">Cek bukti transfer dari penyewa.</p>
      </div>

      <Section title="Menunggu Verifikasi" items={list} books={books} renderActions={(id) => (
        <>
          <Button size="sm" variant="outline" onClick={() => reject(id)} className="rounded-xl"><X className="h-3.5 w-3.5 mr-1" /> Tolak</Button>
          <Button size="sm" onClick={() => approve(id)} className="rounded-xl"><Check className="h-3.5 w-3.5 mr-1" /> Setujui</Button>
        </>
      )} />

      <Section title="Siap Dikirim" items={processing} books={books} renderActions={(id) => (
        <Button size="sm" onClick={() => ship(id)} className="rounded-xl">Input Resi & Kirim</Button>
      )} />
    </div>
  );
}

function Section({ title, items, renderActions, books }: { title: string; items: Order[]; renderActions: (id: string) => React.ReactNode; books: Book[] }) {
  return (
    <div>
      <h2 className="font-serif text-xl mb-3">{title} <span className="text-sm text-muted-foreground">({items.length})</span></h2>
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-muted-foreground text-sm">Tidak ada pesanan di tahap ini.</div>
      ) : (
        <div className="space-y-3">
          {items.map((o) => {
            const b = books.find((x) => x.id === o.bookId)!;
            return (
              <div key={o.id} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start">
                <img src={b.cover} className="h-20 w-16 object-cover rounded-xl" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="font-serif text-lg">{b.title}</div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">#{o.id.slice(-8)} · Total {formatIDR(o.total)} · {o.durationDays} hari</div>
                  <div className="text-xs mt-1">Tujuan: {o.address}</div>
                  {o.paymentProof && (
                    <a href={o.paymentProof} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">Lihat bukti pembayaran</a>
                  )}
                </div>
                <div className="flex gap-2">{renderActions(o.id)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
