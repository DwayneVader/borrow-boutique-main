import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, ShieldCheck, Truck, Wallet, ArrowRight, Calendar, MapPin, Clock, Instagram } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { GENRES, events } from "@/lib/mock-data";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/")({
  component: Home,
});

// Fungsi pembantu untuk mengubah format tanggal kaku (YYYY-MM-DD) menjadi (DD Bulan YYYY)
function formatTanggalIndo(dateString: string) {
  try {
    const opsi: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', opsi);
  } catch {
    return dateString;
  }
}

function Home() {
  const { books } = useApp();
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string | null>(null);

  const popular = [...books].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const filtered = books
    .filter((b) => (genre ? b.genre === genre : true))
    .filter((b) =>
      q ? (b.title + b.author).toLowerCase().includes(q.toLowerCase()) : true
    )
    .slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-strong px-6 sm:px-12 py-12 lg:py-16">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Marketplace sewa buku fisik tepercaya
            </div>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Semua Buku Favoritmu, <span className="italic text-primary">Siap Dipinjam.</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Sewa buku dari toko independen terpercaya di seluruh Indonesia. Deposito aman dan kembali utuh setelah buku dikembalikan.
            </p>

            <div className="mt-6 glass rounded-2xl p-2 flex items-center gap-2 max-w-xl">
              <Search className="h-4 w-4 ml-3 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari judul, penulis, atau toko…"
                className="flex-1 bg-transparent outline-none text-sm py-2"
              />
              <Link
                to="/koleksi"
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
              >
                Cari
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-secondary" /> Rekber aman</span>
              <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-secondary" /> Pengiriman seluruh Indonesia</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="h-4 w-4 text-secondary" /> Deposito 100% kembali</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-3 gap-3">
              {popular.slice(0, 6).map((b, i) => (
                <div
                  key={b.id}
                  className={cn(
                    "rounded-2xl overflow-hidden shadow-soft aspect-[3/4]",
                    i === 1 && "translate-y-6",
                    i === 4 && "translate-y-6"
                  )}
                >
                  <img src={b.cover} alt={b.title} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genre filter capsule */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Telusuri berdasarkan genre</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
          <button
            onClick={() => setGenre(null)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition",
              !genre ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background/40 hover:border-primary/50"
            )}
          >
            Semua
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition",
                genre === g ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background/40 hover:border-primary/50"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Books of the week */}
      <section>
        <div className="mb-5">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Books of the Week</div>
          <h2 className="font-serif text-3xl mt-1">Paling banyak dipinjam minggu ini</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.length ? filtered.map((b) => <BookCard key={b.id} book={b} />) : (
            <div className="col-span-full glass rounded-2xl p-8 text-center text-muted-foreground">Tidak ada hasil.</div>
          )}
        </div>
      </section>

      {/* Events Section - Tetap 3 Kotak Sejajar ke Samping, Desain Konsisten */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Upcoming Events</div>
            <h2 className="font-serif text-3xl mt-1">Komunitas literasi terdekat</h2>
          </div>
          <Link to="/event" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Lihat semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid 3 Kolom Sejajar */}
        <div className="grid md:grid-cols-3 gap-5">
          {events.slice(0, 3).map((e) => {
            const instagramUser = (e as any).instagram || "pinjambuku.id";
            const eventTime = (e as any).time || "19:00 WIB";

            return (
              <Link 
                key={e.id} 
                to="/event" 
                className="group glass rounded-3xl overflow-hidden book-card flex flex-col transition-all duration-300 hover:shadow-md"
              >
                {/* Bagian Poster */}
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img src={e.poster} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-[9px] font-medium px-2 py-0.5 rounded-full text-foreground shadow-sm">
                    🟢 Terbuka
                  </span>
                </div>

                {/* Bagian Informasi & Caption */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-serif text-lg leading-snug group-hover:text-primary transition-colors line-clamp-1">{e.title}</h3>
                  
                  {/* Meta Informasi Garis Baru Biar Ga Sesak */}
                  <div className="flex flex-col gap-1 text-[11px] text-muted-foreground border-b border-foreground/5 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-primary/70" />{formatTanggalIndo(e.date)}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 text-primary/70" />{eventTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-primary/70" />{e.city}</span>
                      <span className="inline-flex items-center gap-1 text-primary/90"><Instagram className="h-3 w-3" />@{instagramUser}</span>
                    </div>
                  </div>

                  {/* Caption Pendek */}
                  <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2">
                    {e.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}