import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BookOpen, ThumbsUp, ThumbsDown } from "lucide-react";
import { useApp } from "@/lib/app-store"; // Import global store
import { stores } from "@/lib/mock-data";  
import { toast } from "sonner";
import * as React from "react";

export const Route = createFileRoute("/_app/admin/katalog")({
  component: ModerasiKatalogPage,
});

// Interface tetap dipertahankan untuk data dummy kamu
interface BukuPengajuan {
  id: string;
  judul: string;
  penulis: string;
  tokoAsal: string;
  hargaSewa: string;
  isDummy?: boolean; // Penanda agar dummy tidak error saat di-click
}

function ModerasiKatalogPage() {
  const { books, updateBookStatus } = useApp();

  // 1. Data dummy kamu tetap stay di sini buat hiasan
  const [dummyList, setDummyList] = React.useState<BukuPengajuan[]>([
    { id: "BK-991", judul: "Harry Potter dan Batu Bertuah (Fisik)", penulis: "J.K. Rowling", tokoAsal: "Buku Mulia Malang", hargaSewa: "Rp 15.000 / minggu", isDummy: true },
    { id: "BK-992", judul: "Atomic Habits - Perubahan Kecil", penulis: "James Clear", tokoAsal: "Gles Bookstore", hargaSewa: "Rp 12.000 / minggu", isDummy: true }
  ]);

  // 2. Ambil buku real-time yang berstatus pending
  const realPendingBooks = books.filter((buku) => buku.status === "pending");

  // 3. Gabungkan data dummy (hiasan) + data asli yang masuk
  // Di-map sedikit supaya strukturnya seragam saat dirender
  const displayBooks = [
    ...dummyList,
    ...realPendingBooks.map((b) => ({
      id: b.id,
      judul: b.title,
      penulis: b.author,
      tokoAsal: stores.find((s) => s.id === b.storeId)?.name || "Toko Tidak Dikenal",
      hargaSewa: `Rp ${b.pricePerDay.toLocaleString()} / hari`,
      isDummy: false
    }))
  ];

  // 4. Handle moderasi (bisa nge-handle data dummy maupun data real)
  const handleModeration = (id: string, action: "terima" | "tolak") => {
    // Cek apakah yang di-klik adalah data dummy
    const isDummy = dummyList.some(d => d.id === id);

    if (isDummy) {
      // Kalau dummy, cukup hapus dari state lokal hiasan
      setDummyList(prev => prev.filter(b => b.id !== id));
      toast.success(`Buku hiasan berhasil di-${action}!`);
    } else {
      // Kalau data real, panggil fungsi store kamu
      if (action === "terima") {
        updateBookStatus(id, "approved");
        toast.success("Buku asli berhasil disetujui!");
      } else {
        const reason = prompt("Masukkan alasan penolakan:");
        if (reason === null) return;
        updateBookStatus(id, "rejected", reason);
        toast.success("Buku asli ditolak.");
      }
    }
  };

  return (
    <div className="p-1 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Moderasi Katalog</h1>
        <p className="text-sm text-muted-foreground mt-1">Validasi kelayakan buku sebelum terbit ke publik.</p>
      </div>

      <div className="glass rounded-3xl p-6 shadow-soft">
        <div className="flex items-center gap-2 border-b pb-3 mb-4">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <h2 className="font-serif text-lg font-semibold">Persetujuan Upload Buku ({displayBooks.length})</h2>
        </div>

        {displayBooks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            🎉 Semua buku telah dimoderasi dengan bersih!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayBooks.map(buku => (
              <div key={buku.id} className="border border-border/80 rounded-2xl p-4 bg-background/50 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">{buku.id}</span>
                    {buku.isDummy && (
                      <span className="text-[9px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md font-medium">Hiasan</span>
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-base text-foreground mt-1">{buku.judul}</h3>
                  <p className="text-xs text-muted-foreground">Penulis: {buku.penulis}</p>
                  <div className="mt-2 text-xs bg-purple-500/5 text-purple-700 p-2 rounded-xl border border-purple-500/10">
                    🏪 Toko: <strong>{buku.tokoAsal}</strong> | Rent: {buku.hargaSewa}
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t w-full">
                  <Button size="sm" variant="ghost" className="w-full text-red-500 hover:bg-red-50" onClick={() => handleModeration(buku.id, "tolak")}>
                    <ThumbsDown className="h-3.5 w-3.5 mr-1" /> Tolak
                  </Button>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => handleModeration(buku.id, "terima")}>
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Loloskan
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