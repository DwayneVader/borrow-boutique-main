import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { GENRES, stores } from "@/lib/mock-data";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/koleksi")({
  component: KoleksiPage,
});

function KoleksiPage() {
  const { books } = useApp();
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [sort, setSort] = useState<"populer" | "termurah" | "termahal">("populer");

  let list = books
    .filter((b) => (genre ? b.genre === genre : true))
    .filter((b) => (storeId ? b.storeId === storeId : true))
    .filter((b) => q ? (b.title + b.author).toLowerCase().includes(q.toLowerCase()) : true);

  if (sort === "termurah") list = [...list].sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (sort === "termahal") list = [...list].sort((a, b) => b.pricePerDay - a.pricePerDay);
  if (sort === "populer") list = [...list].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Daftar Koleksi</h1>
        <p className="text-sm text-muted-foreground mt-1">Telusuri seluruh buku dari toko mitra kami.</p>
      </div>

      <div className="glass rounded-2xl p-3 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul, penulis…"
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
        </div>
        <select
          value={storeId ?? ""}
          onChange={(e) => setStoreId(e.target.value || null)}
          className="rounded-xl bg-background/60 border border-border px-3 py-2 text-sm"
        >
          <option value="">Semua Toko</option>
          {stores.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.city}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "populer" | "termurah" | "termahal")}
          className="rounded-xl bg-background/60 border border-border px-3 py-2 text-sm"
        >
          <option value="populer">Paling Populer</option>
          <option value="termurah">Harga Terendah</option>
          <option value="termahal">Harga Tertinggi</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        <button
          onClick={() => setGenre(null)}
          className={cn("shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium",
            !genre ? "bg-primary text-primary-foreground border-primary" : "border-border")}
        >Semua</button>
        {GENRES.map((g) => (
          <button key={g} onClick={() => setGenre(g)}
            className={cn("shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium",
              genre === g ? "bg-primary text-primary-foreground border-primary" : "border-border")}
          >{g}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map((b) => <BookCard key={b.id} book={b} />)}
      </div>
      {list.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Tidak ada buku yang cocok.</div>
      )}
    </div>
  );
}
