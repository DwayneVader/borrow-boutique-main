import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, X, Store, AlertCircle } from "lucide-react";
import * as React from "react";

// Menggunakan format flat path bawaan proyekmu
export const Route = createFileRoute("/_app/admin/toko")({
  component: VerifikasiTokoPage,
});

interface TokoPengajuan {
  id: string;
  namaToko: string;
  pemilik: string;
  email: string;
  tanggal: string;
  status: "pending" | "disetujui" | "ditolak";
}

function VerifikasiTokoPage() {
  const [pengajuan, setPengajuan] = React.useState<TokoPengajuan[]>(() => {
    const saved = localStorage.getItem("dev_pengajuan_toko");
    if (saved) return JSON.parse(saved);
    
    return [
      { id: "TK-001", namaToko: "Buku Mulia Malang", pemilik: "Gles Admin", email: "gles@mail.com", tanggal: "2026-05-28", status: "pending" },
      { id: "TK-002", namaToko: "Toko Kitab Kuning", pemilik: "Ahmad Jauhari", email: "ahmad@mail.com", tanggal: "2026-05-29", status: "pending" },
    ];
  });

  React.useEffect(() => {
    localStorage.setItem("dev_pengajuan_toko", JSON.stringify(pengajuan));
  }, [pengajuan]);

  const handleAction = (id: string, status: "disetujui" | "ditolak") => {
    setPengajuan(prev => prev.map(toko => toko.id === id ? { ...toko, status } : toko));
  };

  const pendingItems = pengajuan.filter(t => t.status === "pending");

  return (
    <div className="p-1 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Verifikasi Toko</h1>
        <p className="text-sm text-muted-foreground mt-1">Persetujuan pendaftaran mitra toko baru di PinjamBuku.</p>
      </div>

      <div className="glass rounded-3xl p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Store className="h-5 w-5 text-purple-600" />
          <h2 className="font-serif text-lg font-semibold">Antrean Pengajuan Aktif ({pendingItems.length})</h2>
        </div>

        {pendingItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/20">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Tidak ada pengajuan toko baru yang perlu diverifikasi.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {pendingItems.map((toko) => (
              <div key={toko.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <div className="font-medium text-base flex items-center gap-2">
                    {toko.namaToko}
                    <span className="text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full font-mono">{toko.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Pemilik: {toko.pemilik} ({toko.email})</p>
                  <p className="text-[11px] text-muted-foreground/80">Diajukan pada: {toko.tanggal}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleAction(toko.id, "ditolak")}
                  >
                    <X className="h-4 w-4 mr-1" /> Tolak
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleAction(toko.id, "disetujui")}
                  >
                    <Check className="h-4 w-4 mr-1" /> Setujui Toko
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}