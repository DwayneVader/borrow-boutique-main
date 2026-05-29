import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { GENRES, stores, type Genre } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { NotStoreOwner } from "./toko.index";

export const Route = createFileRoute("/_app/toko/upload")({
  component: UploadBuku,
});

function UploadBuku() {
  const { user, addBook } = useApp();
  const nav = useNavigate();
  if (!user?.isStoreOwner) return <NotStoreOwner />;
  const store = stores.find((s) => s.id === user.storeId)!;

  const [form, setForm] = useState({
    title: "", author: "", genre: GENRES[0] as Genre, synopsis: "",
    pricePerDay: 4000, deposit: 75000, stock: 1, cover: "",
    publisher: "", year: new Date().getFullYear(), pages: 200,
  });

  // 🟢 UBAH MENJADI SEPERTI INI:
const submit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.title || !form.author) return toast.error("Judul dan penulis wajib diisi");
  if (!form.cover) return toast.error("Unggah cover buku");
  
  // Tambahkan status: "pending" di sini agar sesuai kontrak tipe data Book
  addBook({ 
    ...form, 
    rating: 0, 
    reviewsCount: 0, 
    storeId: store.id,
    status: "pending" // 👈 Penyelamat dari error TypeScript!
  });
  
  toast.success("Buku berhasil diajukan untuk moderasi");
  nav({ to: "/toko/buku" });
};

  const onCover = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setForm((f) => ({ ...f, cover: String(r.result) }));
    r.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Upload Buku</h1>
        <p className="text-sm text-muted-foreground mt-1">Lengkapi detail buku untuk dipublikasikan.</p>
      </div>
      <form onSubmit={submit} className="glass rounded-3xl p-6 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>Cover Buku</Label>
          <label className="mt-1 flex items-center gap-4 rounded-2xl border-2 border-dashed border-border p-4 cursor-pointer hover:border-primary/50">
            <input type="file" accept="image/*" hidden onChange={(e) => onCover(e.target.files?.[0])} />
            {form.cover
              ? <img src={form.cover} className="h-24 w-18 object-cover rounded-lg" alt="" />
              : <div className="h-24 w-18 rounded-lg bg-muted grid place-items-center text-xs text-muted-foreground">Cover</div>}
            <div className="text-sm text-muted-foreground">Klik untuk pilih gambar cover.</div>
          </label>
        </div>
        <Field label="Judul" v={form.title} on={(v) => setForm({ ...form, title: v })} />
        <Field label="Penulis" v={form.author} on={(v) => setForm({ ...form, author: v })} />
        <div>
          <Label>Genre</Label>
          <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value as Genre })} className="mt-1 w-full input-glass">
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <Field label="Penerbit" v={form.publisher} on={(v) => setForm({ ...form, publisher: v })} />
        <NumField label="Harga sewa / hari (Rp)" v={form.pricePerDay} on={(v) => setForm({ ...form, pricePerDay: v })} />
        <NumField label="Deposito (Rp)" v={form.deposit} on={(v) => setForm({ ...form, deposit: v })} />
        <NumField label="Stok awal" v={form.stock} on={(v) => setForm({ ...form, stock: v })} />
        <NumField label="Jumlah halaman" v={form.pages} on={(v) => setForm({ ...form, pages: v })} />
        <NumField label="Tahun terbit" v={form.year} on={(v) => setForm({ ...form, year: v })} />
        <div className="sm:col-span-2">
          <Label>Sinopsis</Label>
          <textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} rows={4} className="mt-1 w-full input-glass" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full h-11 rounded-xl">Publikasikan Buku</Button>
        </div>
      </form>
      <style>{`
        .input-glass { background: color-mix(in oklab, var(--color-background) 60%, transparent); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 0.55rem 0.85rem; font-size: 0.875rem; outline: none; width: 100%; }
        .input-glass:focus { border-color: color-mix(in oklab, var(--color-primary) 60%, transparent); }
      `}</style>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{children}</label>;
}
function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return <div><Label>{label}</Label><input value={v} onChange={(e) => on(e.target.value)} className="mt-1 input-glass" /></div>;
}
function NumField({ label, v, on }: { label: string; v: number; on: (v: number) => void }) {
  return <div><Label>{label}</Label><input type="number" value={v} onChange={(e) => on(Number(e.target.value))} className="mt-1 input-glass" /></div>;
}
