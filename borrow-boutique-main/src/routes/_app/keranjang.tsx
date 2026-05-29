import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { stores, formatIDR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/keranjang")({
  component: CartPage,
});

function CartPage() {
  const { cart, books, removeFromCart, user } = useApp();
  if (!user) {
    return (
      <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto mt-12">
        <ShoppingCart className="h-10 w-10 mx-auto text-primary mb-3" />
        <h2 className="font-serif text-2xl">Keranjangmu menunggu</h2>
        <p className="text-sm text-muted-foreground mt-2">Masuk untuk mengelola keranjang.</p>
        <Link to="/login" className="mt-5 inline-block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Masuk</Link>
      </div>
    );
  }

  const items = cart.map((c) => books.find((b) => b.id === c.bookId)!).filter(Boolean);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Keranjang</h1>
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          Keranjang kosong. <Link to="/koleksi" className="text-primary hover:underline">Cari buku</Link>.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => {
            const store = stores.find((s) => s.id === b.storeId)!;
            return (
              <div key={b.id} className="glass rounded-2xl p-4 flex gap-4 items-center">
                <img src={b.cover} alt={b.title} className="h-20 w-16 object-cover rounded-xl" />
                <div className="flex-1 min-w-0">
                  <Link to="/buku/$id" params={{ id: b.id }} className="font-serif text-lg hover:text-primary truncate block">{b.title}</Link>
                  <div className="text-xs text-muted-foreground">{b.author} · {store.name}</div>
                  <div className="text-sm text-primary mt-1">{formatIDR(b.pricePerDay)} / hari</div>
                </div>
                <Button asChild size="sm" className="rounded-xl">
                  <Link to="/checkout/$id" params={{ id: b.id }}>
                    Checkout <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { removeFromCart(b.id); toast.success("Dihapus dari keranjang"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
