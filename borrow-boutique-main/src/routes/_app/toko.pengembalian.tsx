import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { stores, formatIDR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { NotStoreOwner } from "./toko.index";
import * as React from "react";

export const Route = createFileRoute("/_app/toko/pengembalian")({
  component: VerifikasiPengembalian,
});

const FINE_PER_DAY = 5000;

function VerifikasiPengembalian() {
  const { user, orders, books, updateOrder } = useApp();
  const [activeTab, setActiveTab] = React.useState<"pesanan_baru" | "pengembalian">("pengembalian");

  if (!user?.isStoreOwner) return <NotStoreOwner />;
  const store = stores.find((s) => s.id === user.storeId)!;

  // Filter 1: Untuk Tab Verifikasi Pengembalian Buku & Cairkan Deposito
  const returnList = orders.filter((o) => o.storeId === store.id && o.status === "proses_pengembalian");

  // Filter 2: Untuk Tab Kelola Pesanan Baru Masuk & Kirim Resi
  const newOrdersList = orders.filter((o) => o.storeId === store.id && (o.status === "menunggu_verifikasi" || o.status === "diproses"));

  const computeFine = (o: typeof returnList[number]) => {
    const start = new Date(o.startDate);
    const due = new Date(start.getTime() + o.durationDays * 86400000);
    const now = new Date();
    const lateDays = Math.max(0, Math.floor((now.getTime() - due.getTime()) / 86400000));
    return lateDays * FINE_PER_DAY;
  };

  const refundFull = (id: string) => {
    const o = returnList.find((x) => x.id === id)!;
    const fine = computeFine(o);
    const refunded = Math.max(0, o.deposit - fine);
    updateOrder(id, { status: "selesai", fine, refunded });
    toast.success(`Deposito dicairkan ${formatIDR(refunded)}${fine > 0 ? `, denda ${formatIDR(fine)}` : ""}`);
  };

  // FIX: Mengambil data order 'o' terlebih dahulu agar tidak memicu error "cannot find name 'o'"
  const claim = (id: string) => {
    const reason = prompt("Alasan klaim (rusak/hilang):"); 
    if (!reason) return;
    
    const o = returnList.find((x) => x.id === id);
    if (!o) return;

    updateOrder(id, { status: "selesai", fine: o.deposit, refunded: 0 });
    toast.success("Deposito diklaim penuh sebagai ganti rugi kerusakan");
  };

  const handleShip = (id: string) => {
    const resi = prompt("Masukkan Nomor Resi Pengiriman Buku Ke Penyewa:");
    if (!resi) return;
    updateOrder(id, { status: "dikirim", trackingForward: resi });
    toast.success("Resi diinput! Status buku sekarang: DIKIRIM.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Kelola Logistik Toko</h1>
          <p className="text-sm text-muted-foreground mt-1">Verifikasi pembayaran, kelola pengiriman, dan cairkan deposito retur buku.</p>
        </div>
        {/* Tab Switcher */}
        <div className="flex bg-muted p-1 rounded-xl self-start">
          <button onClick={() => setActiveTab("pengembalian")} className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === "pengembalian" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
            Pengembalian ({returnList.length})
          </button>
          <button onClick={() => setActiveTab("pesanan_baru")} className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === "pesanan_baru" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
            Pesanan Masuk ({newOrdersList.length})
          </button>
        </div>
      </div>

      {activeTab === "pengembalian" ? (
        // VIEW TAB 1: VERIFIKASI RETUR BUKU YANG SUDAH KAMU BUAT
        returnList.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Tidak ada pengembalian menunggu.</div>
        ) : (
          <div className="space-y-3">
            {returnList.map((o) => {
              const b = books.find((x) => x.id === o.bookId)!;
              const fine = computeFine(o);
              return (
                <div key={o.id} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                  <img src={b.cover} className="h-24 w-18 object-cover rounded-xl" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <div className="font-serif text-lg">{b.title}</div>
                        <div className="text-xs text-muted-foreground">#{o.id.slice(-8)} · Kurir Balik: {o.returnCourier} · Resi: {o.trackingReturn}</div>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Deposito:</span> <span className="font-medium">{formatIDR(o.deposit)}</span></div>
                      <div><span className="text-muted-foreground">Denda:</span> <span className={fine > 0 ? "text-destructive font-medium" : "font-medium"}>{formatIDR(fine)}</span></div>
                      <div><span className="text-muted-foreground">Hak Cair User:</span> <span className="font-medium text-success">{formatIDR(Math.max(0, o.deposit - fine))}</span></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 justify-center">
                    <Button size="sm" onClick={() => refundFull(o.id)} className="rounded-xl">Buku Aman · Cairkan</Button>
                    <Button size="sm" variant="outline" onClick={() => claim(o.id)} className="rounded-xl text-destructive">Klaim Rusak/Hilang</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        // VIEW TAB 2: PROSES PESANAN BARU MASUK
        newOrdersList.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Belum ada pesanan baru masuk dari penyewa.</div>
        ) : (
          <div className="space-y-3">
            {newOrdersList.map((o) => {
              const b = books.find((x) => x.id === o.bookId)!;
              return (
                <div key={o.id} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center flex-1">
                    <img src={b.cover} className="h-16 w-12 object-cover rounded-lg" alt="" />
                    <div>
                      <div className="font-serif text-base">{b.title}</div>
                      <div className="text-xs text-muted-foreground">ID: #{o.id.slice(-8)} · Kurir Kirim Pilihan: {o.courier}</div>
                      <div className="text-xs font-semibold text-purple-600 mt-1">Uang Sewa + Ongkir: {formatIDR(o.rentTotal + o.shipping)} (Masuk Rekber Admin)</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {o.status === "menunggu_verifikasi" && (
                      <Button size="sm" onClick={() => updateOrder(o.id, { status: "diproses" })} className="bg-amber-600 text-white rounded-xl">
                        Accept & Kemas Buku
                      </Button>
                    )}
                    {o.status === "diproses" && (
                      <Button size="sm" onClick={() => handleShip(o.id)} className="bg-blue-600 text-white rounded-xl">
                        🚚 Input Resi Pengiriman
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}