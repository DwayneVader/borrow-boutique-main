import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Star, MapPin, BookOpen, Calendar } from "lucide-react";
import { stores } from "@/lib/mock-data";
import { useApp } from "@/lib/app-store";
import { BookCard } from "@/components/book-card";

export const Route = createFileRoute("/_app/toko/$id")({
  component: StorePage,
});

function StorePage() {
  const { id } = Route.useParams();
  const store = stores.find((s) => s.id === id);
  if (!store) throw notFound();
  const { books } = useApp();
  const storeBooks = books.filter((b) => b.storeId === store.id);

  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl overflow-hidden glass">
        <div className="aspect-[16/5] relative">
          <img src={store.banner} alt={store.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-16 relative flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <img src={store.cover} alt={store.name} className="h-24 w-24 rounded-2xl object-cover border-4 border-background shadow-lift" />
          <div className="flex-1">
            <h1 className="font-serif text-3xl">{store.name}</h1>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{store.city}</span>
              <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-amber-500 fill-current" />{store.rating} ({store.reviews} ulasan)</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />Bergabung {store.joined}</span>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 text-sm text-foreground/80 max-w-3xl">{store.description}</div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5"><div className="text-xs uppercase text-muted-foreground">Total Buku</div><div className="font-serif text-2xl mt-1">{store.totalBooks}</div></div>
        <div className="glass rounded-2xl p-5"><div className="text-xs uppercase text-muted-foreground">Total Disewa</div><div className="font-serif text-2xl mt-1">{store.totalRented}</div></div>
        <div className="glass rounded-2xl p-5"><div className="text-xs uppercase text-muted-foreground">Rating Toko</div><div className="font-serif text-2xl mt-1 text-amber-500">{store.rating} ★</div></div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-2xl">Koleksi Toko</h2>
        </div>
        {storeBooks.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Belum ada buku yang dipublikasikan.</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {storeBooks.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        )}
      </section>

      <Link to="/koleksi" className="inline-block text-sm text-primary hover:underline">← Telusuri toko lain</Link>
    </div>
  );
}
