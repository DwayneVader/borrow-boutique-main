import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { stores, formatIDR, type Book } from "@/lib/mock-data";
import { NotStoreOwner } from "./toko.index";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Edit2, Trash2, X, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/_app/toko/buku")({
  component: KelolaBukuPage,
});

function KelolaBukuPage() {
  // Ambil data user, buku, dan fungsi updater dari store global
  const { user, books, setBooks } = useApp(); 
  
  // State untuk mengontrol dropdown baris mana yang aktif
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // State untuk menyimpan data buku yang sedang diedit di dalam modal (menggunakan type Book asli)
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  if (!user?.isStoreOwner) return <NotStoreOwner />;
  const store = stores.find((s) => s.id === user.storeId)!;
  const list = books.filter((b) => b.storeId === store.id);

  // ==========================================
  // LOGIC AKSIS: HAPUS BUKU
  // ==========================================
  const handleConfirmDelete = (bookId: string, title: string) => {
    const yakin = window.confirm(`Apakah kamu yakin ingin menghapus katalog buku "${title}"?`);
    if (yakin && setBooks) {
      const updatedList = books.filter((b) => b.id !== bookId);
      setBooks(updatedList); 
      setActiveDropdown(null);
    }
  };

  // ==========================================
  // LOGIC AKSIS: SIMPAN HASIL EDIT
  // ==========================================
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook && setBooks) {
      const updatedList = books.map((b) => (b.id === editingBook.id ? editingBook : b));
      setBooks(updatedList); // Update state global / localStorage
      setEditingBook(null);  // Tutup modal otomatis
      setActiveDropdown(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl">Kelola Buku</h1>
          <p className="text-sm text-muted-foreground mt-1">{list.length} buku terdaftar.</p>
        </div>
        <Link to="/toko/upload" className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
          + Upload Buku
        </Link>
      </div>

      {/* TABEL KATALOG */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 text-xs uppercase tracking-wider text-muted-foreground px-4 py-3 border-b border-border/60">
          <div className="col-span-5">Buku</div>
          <div className="col-span-2">Harga/hari</div>
          <div className="col-span-2">Deposito</div>
          <div className="col-span-2 text-right">Stok</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        {list.map((b) => (
          <div key={b.id} className="grid grid-cols-12 items-center px-4 py-3 border-b border-border/30 last:border-0 hover:bg-foreground/5 relative">
            {/* Kolom Info Buku */}
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <img src={b.cover} className="h-12 w-9 object-cover rounded-md shrink-0 bg-muted" alt="" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{b.title}</div>
                <div className="text-xs text-muted-foreground truncate">{b.author} · {b.genre}</div>
              </div>
            </div>

            {/* Kolom Harga */}
            <div className="col-span-2 text-sm text-primary">{formatIDR(b.pricePerDay)}</div>
            
            {/* Kolom Deposito */}
            <div className="col-span-2 text-sm">{formatIDR(b.deposit)}</div>
            
            {/* Kolom Stok */}
            <div className={cn("col-span-2 text-sm text-right font-medium", b.stock === 0 ? "text-destructive" : "text-success")}>
              {b.stock}
            </div>

            {/* Kolom Tombol Dropdown Titik Tiga */}
            <div className="col-span-1 flex justify-center relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === b.id ? null : b.id)}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {/* FLOATING ACTION MENU */}
              {activeDropdown === b.id && (
                <>
                  {/* Backdrop transparan kecil buat nutup dropdown kalau klik luar */}
                  <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                  
                  <div className="absolute right-2 top-9 w-32 bg-background border rounded-xl shadow-lg p-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => setEditingBook(b)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-left hover:bg-muted text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                      Edit Buku
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(b.id, b.title)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-left hover:bg-destructive/10 text-destructive font-medium"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus Buku
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">Belum ada buku.</div>}
      </div>

      {/* ======================================================== */}
      {/* POP-UP COMPONENT: MODAL EDIT DATA BUKU (KEMBARAN UPLOAD) */}
      {/* ======================================================== */}
      {editingBook && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="glass w-full max-w-4xl bg-background rounded-2xl p-6 border shadow-xl flex flex-col space-y-6 my-8 animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-2xl font-serif font-semibold">Edit Detail Buku</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Lengkapi detail buku untuk diperbarui.</p>
              </div>
              <button 
                onClick={() => setEditingBook(null)} 
                className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Utama Layout Kembaran Upload Buku */}
            <form onSubmit={handleSaveEdit} className="space-y-5 text-sm">
              
              {/* COVER BUKU SECTION */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Cover Buku</label>
                <div className="flex items-center gap-4 p-4 bg-muted/20 border border-dashed rounded-xl">
                  <img src={editingBook.cover} className="h-24 w-18 object-cover rounded-md border shadow-sm shrink-0 bg-muted" alt="" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground block mb-1">Preview Sampul Aktif</span>
                    Ubah URL cover langsung di database mock-data jika ingin mengganti gambar sampul.
                  </div>
                </div>
              </div>

              {/* BARIS 1: JUDUL & PENULIS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Judul</label>
                  <input
                    type="text"
                    required
                    value={editingBook.title}
                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Penulis</label>
                  <input
                    type="text"
                    required
                    value={editingBook.author || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* BARIS 2: GENRE & PENERBIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Genre</label>
                  <select
                    value={editingBook.genre}
                    onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value as Book["genre"] })}
                    className="w-full bg-background border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Fiksi">Fiksi</option>
                    <option value="Romansa">Romansa</option>
                    <option value="Sastra">Sastra</option>
                    <option value="Non-Fiksi">Non-Fiksi</option>
                    <option value="Misteri">Misteri</option>
                    <option value="Fantasi">Fantasi</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Penerbit</label>
                  <input
                    type="text"
                    value={(editingBook as any).publisher || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value } as any)}
                    className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Masukkan nama penerbit"
                  />
                </div>
              </div>

              {/* BARIS 3: HARGA SEWA & DEPOSITO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Harga Sewa / Hari (RP)</label>
                  <input
                    type="number"
                    required
                    value={editingBook.pricePerDay}
                    onChange={(e) => setEditingBook({ ...editingBook, pricePerDay: Number(e.target.value) })}
                    className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Deposito (RP)</label>
                  <input
                    type="number"
                    required
                    value={editingBook.deposit}
                    onChange={(e) => setEditingBook({ ...editingBook, deposit: Number(e.target.value) })}
                    className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* BARIS 4: STOK AWAL & JUMLAH HALAMAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Stok Awal</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingBook.stock}
                    onChange={(e) => setEditingBook({ ...editingBook, stock: Number(e.target.value) })}
                    className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Jumlah Halaman</label>
                  <input
                    type="number"
                    value={(editingBook as any).pages || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, pages: Number(e.target.value) } as any)}
                    className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* BARIS 5: TAHUN TERBIT */}
              <div className="w-full md:w-1/2 md:pr-2 space-y-1.5">
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Tahun Terbit</label>
                <input
                  type="text"
                  value={(editingBook as any).year || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, year: e.target.value } as any)}
                  className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* BARIS 6: SINOPSIS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Sinopsis</label>
                <textarea
                  rows={4}
                  value={(editingBook as any).synopsis || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, synopsis: e.target.value } as any)}
                  className="w-full bg-background border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Tuliskan ringkasan cerita buku..."
                />
              </div>

              {/* TOMBOL AKSI BAWAH */}
              <div className="flex gap-3 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-5 py-2.5 border rounded-xl text-xs font-medium hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}