import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Star, MapPin, ChevronLeft, BookOpen as BookIcon, Edit2, Trash2 } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { stores, formatIDR } from "@/lib/mock-data";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/buku/$id")({
  component: BookDetail,
});

function BookDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { books, favorites, toggleFavorite, requireAuth, addToCart, user, reviews, addReview, updateReview, deleteReview } = useApp();
  const book = books.find((b) => b.id === id);
  if (!book) throw notFound();
  const store = stores.find((s) => s.id === book.storeId)!;
  const fav = favorites.includes(book.id);
  const out = book.stock === 0;
  const bookReviews = reviews.filter((r) => r.bookId === book.id);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const related = books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4);

  const handleRent = () => {
    if (!requireAuth("Sewa buku")) return;
    navigate({ to: "/checkout/$id", params: { id: book.id } });
  };

  const submitReview = () => {
    if (!requireAuth("Tulis ulasan")) return;
    if (!reviewText.trim()) { toast.error("Tulis ulasanmu dulu"); return; }
    if (editingId) {
      updateReview(editingId, reviewText, reviewRating);
      toast.success("Ulasan diperbarui");
      setEditingId(null);
    } else {
      addReview({ bookId: book.id, user: user!.name, rating: reviewRating, text: reviewText });
      toast.success("Ulasan terkirim");
    }
    setReviewText(""); setReviewRating(5);
  };

  return (
    <div className="space-y-10">
      <Link to="/koleksi" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kembali ke koleksi
      </Link>

      <div className="grid lg:grid-cols-[340px_1fr] gap-8">
        <div className="space-y-4">
          <div className="glass rounded-3xl overflow-hidden aspect-[3/4]">
            <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
          </div>
          <button
            onClick={() => toggleFavorite(book.id)}
            className={cn("w-full rounded-2xl border border-border py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-primary/10",
              fav && "border-primary/50 text-primary")}
          >
            <Heart className={cn("h-4 w-4", fav && "fill-current")} />
            {fav ? "Tersimpan di Favorit" : "Tambah ke Favorit"}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-medium">{book.genre}</span>
            <h1 className="font-serif text-4xl mt-1 leading-tight">{book.title}</h1>
            <p className="text-muted-foreground mt-2">oleh <span className="font-medium text-foreground">{book.author}</span></p>
            <div className="flex items-center gap-3 mt-3 text-sm">
              <div className="inline-flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" /> <span className="font-medium text-foreground">{book.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">{book.reviewsCount} ulasan · {book.pages} halaman · {book.year}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="glass rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sewa / hari</div>
              <div className="font-serif text-2xl text-primary">{formatIDR(book.pricePerDay)}</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Deposito</div>
              <div className="font-serif text-2xl">{formatIDR(book.deposit)}</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Stok fisik</div>
              <div className={cn("font-serif text-2xl", out ? "text-destructive" : "text-success")}>{out ? "0" : book.stock}</div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-2">Sinopsis</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{book.synopsis}</p>
            <div className="mt-3 text-xs text-muted-foreground">Penerbit: {book.publisher}</div>
          </div>

          <Link to="/toko/$id" params={{ id: store.id }} className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-primary/40 transition">
            <img src={store.cover} alt={store.name} className="h-14 w-14 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Disewakan oleh</div>
              <div className="font-serif text-base">{store.name}</div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{store.city}</span>
                <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-current" />{store.rating}</span>
              </div>
            </div>
            <span className="text-xs text-primary">Lihat toko →</span>
          </Link>

          <div className="flex gap-3">
            <Button
              onClick={handleRent}
              disabled={out}
              className="flex-1 h-12 rounded-2xl text-base"
            >
              {out ? "Sedang Dipinjam" : "Sewa Sekarang"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { if (!requireAuth("Tambah ke keranjang")) return; addToCart(book.id); toast.success("Ditambahkan ke keranjang"); }}
              disabled={out}
              className="h-12 rounded-2xl"
            >
              + Keranjang
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Ulasan Pembaca</h2>
        <div className="glass rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setReviewRating(n)}>
                <Star className={cn("h-5 w-5", n <= reviewRating ? "text-amber-500 fill-current" : "text-muted-foreground/40")} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Bagikan kesanmu setelah membaca…"
            className="w-full bg-background/50 rounded-xl border border-border p-3 text-sm outline-none focus:border-primary/50 min-h-[88px]"
          />
          <div className="flex justify-end mt-3 gap-2">
            {editingId && (
              <Button variant="ghost" onClick={() => { setEditingId(null); setReviewText(""); }}>Batal</Button>
            )}
            <Button onClick={submitReview} className="rounded-xl">{editingId ? "Perbarui" : "Kirim Ulasan"}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {bookReviews.length === 0 && <div className="text-sm text-muted-foreground">Belum ada ulasan. Jadilah yang pertama!</div>}
          {bookReviews.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{r.user}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "text-amber-500 fill-current" : "text-muted-foreground/30")} />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">{r.date}</span>
                  </div>
                </div>
                {user?.name === r.user && (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingId(r.id); setReviewText(r.text); setReviewRating(r.rating); }}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { deleteReview(r.id); toast.success("Ulasan dihapus"); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-foreground/85">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookIcon className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-2xl">Buku sejenis</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}
