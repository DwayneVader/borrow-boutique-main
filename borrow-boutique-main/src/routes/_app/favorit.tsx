import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { BookCard } from "@/components/book-card";

export const Route = createFileRoute("/_app/favorit")({
  component: FavoritPage,
});

function FavoritPage() {
  const { favorites, books, user } = useApp();
  const list = books.filter((b) => favorites.includes(b.id));

  if (!user) {
    return (
      <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto mt-12">
        <Heart className="h-10 w-10 mx-auto text-primary mb-3" />
        <h2 className="font-serif text-2xl">Simpan buku impianmu</h2>
        <p className="text-sm text-muted-foreground mt-2">Masuk untuk menyimpan buku ke daftar favorit.</p>
        <Link to="/login" className="mt-5 inline-block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Masuk</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Favorit</h1>
        <p className="text-sm text-muted-foreground mt-1">{list.length} buku tersimpan.</p>
      </div>
      {list.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Belum ada favorit. Mulai jelajahi <Link to="/koleksi" className="text-primary hover:underline">koleksi</Link>.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      )}
    </div>
  );
}
