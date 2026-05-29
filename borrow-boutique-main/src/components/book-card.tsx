import { Link } from "@tanstack/react-router";
import { Heart, Star, MapPin } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { stores, formatIDR, type Book } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BookCard({ book }: { book: Book }) {
  const { favorites, toggleFavorite } = useApp();
  const fav = favorites.includes(book.id);
  const store = stores.find((s) => s.id === book.storeId);
  const outOfStock = book.stock === 0;

  return (
    <div className="book-card group glass rounded-3xl overflow-hidden flex flex-col">
      <Link to="/buku/$id" params={{ id: book.id }} className="relative block aspect-[3/4] overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between">
          <span className="rounded-full bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/80">
            {book.genre}
          </span>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(book.id); }}
            className={cn(
              "heart-pop rounded-full bg-background/80 backdrop-blur p-2 shadow-soft",
              fav ? "text-primary" : "text-foreground/60"
            )}
            aria-label="favorit"
          >
            <Heart className={cn("h-4 w-4", fav && "fill-current")} />
          </button>
        </div>
        {outOfStock && (
          <div className="absolute inset-x-3 bottom-3 rounded-xl bg-foreground/85 text-background text-xs font-medium px-3 py-1.5 text-center backdrop-blur">
            Sedang Dipinjam
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-serif text-base leading-snug line-clamp-2">
          <Link to="/buku/$id" params={{ id: book.id }} className="hover:text-primary transition-colors">
            {book.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-foreground/80 font-medium">{book.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">· {book.reviewsCount} ulasan</span>
        </div>
        {store && (
          <Link
            to="/toko/$id"
            params={{ id: store.id }}
            className="mt-auto flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-secondary transition-colors"
          >
            <MapPin className="h-3 w-3" />
            <span className="font-medium text-foreground/75">{store.name}</span>
            <span>· {store.city}</span>
          </Link>
        )}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sewa / hari</div>
            <div className="font-serif text-base text-primary font-semibold">{formatIDR(book.pricePerDay)}</div>
          </div>
          <Link
            to="/buku/$id"
            params={{ id: book.id }}
            className="rounded-xl bg-foreground/[0.06] hover:bg-primary hover:text-primary-foreground px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
