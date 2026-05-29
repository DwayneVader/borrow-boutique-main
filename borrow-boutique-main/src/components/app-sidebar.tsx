import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, BookOpen, Heart, ShoppingCart, Receipt, History, Calendar, User,
  Store as StoreIcon, Upload, ClipboardCheck, PackageCheck, BarChart3,
  Moon, Sun, LogOut, LogIn, Menu, ArrowLeftRight, ShieldCheck, Coins, Users, Landmark
} from "lucide-react";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Item = { label: string; to: string; icon: React.ComponentType<{ className?: string }> };

const userMenu: Item[] = [
  { label: "Beranda", to: "/", icon: Home },
  { label: "Daftar Koleksi", to: "/koleksi", icon: BookOpen },
  { label: "Favorit", to: "/favorit", icon: Heart },
  { label: "Keranjang", to: "/keranjang", icon: ShoppingCart },
  { label: "Transaksi", to: "/transaksi", icon: Receipt },
  { label: "Riwayat Peminjaman", to: "/riwayat", icon: History },
  { label: "Event", to: "/event", icon: Calendar },
  { label: "Profile", to: "/profile", icon: User },
];

const storeMenu: Item[] = [
  { label: "Dashboard", to: "/toko", icon: BarChart3 },
  { label: "Kelola Buku", to: "/toko/buku", icon: BookOpen },
  { label: "Upload Buku", to: "/toko/upload", icon: Upload },
  { label: "Verifikasi Pesanan", to: "/toko/verifikasi", icon: ClipboardCheck },
  { label: "Verifikasi Pengembalian", to: "/toko/pengembalian", icon: PackageCheck },
  { label: "Riwayat & Pendapatan", to: "/toko/riwayat", icon: Receipt },
  { label: "Profile", to: "/profile", icon: User },
];

// MENU BARU: KHUSUS MODUL SUPER ADMIN (PROTOTYPE TRANS-APPROVAL & MODERASI)
const adminMenu: Item[] = [
  { label: "Dashboard Global", to: "/admin/dashboard", icon: BarChart3 },
  { label: "Pencairan Dana", to: "/admin/pencairan", icon: Landmark },
  { label: "Verifikasi Toko", to: "/admin/toko", icon: StoreIcon },
  { label: "Moderasi Katalog", to: "/admin/katalog", icon: ShieldCheck },
  { label: "Manajemen User", to: "/admin/users", icon: Users },
  { label: "Profile", to: "/profile", icon: User },
];

function NavList({ items, onNavigate }: { items: Item[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { favorites = [], cart = [], orders = [] } = useApp();

  const [hasVisitedEvent, setHasVisitedEvent] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pinjambuku_visited_event") === "true";
    }
    return false;
  });

  const [hasVisitedKoleksi, setHasVisitedKoleksi] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pinjambuku_visited_koleksi") === "true";
    }
    return false;
  });

  const handleItemClick = (label: string) => {
    if (label === "Event") {
      localStorage.setItem("pinjambuku_visited_event", "true");
      setHasVisitedEvent(true);
    }
    if (label === "Daftar Koleksi") {
      localStorage.setItem("pinjambuku_visited_koleksi", "true");
      setHasVisitedKoleksi(true);
    }
    if (onNavigate) onNavigate();
  };

  const getBadgeCount = (label: string) => {
    switch (label) {
      case "Favorit":
        return favorites.length;
      case "Keranjang":
        return cart.length;
      case "Verifikasi Pesanan":
        const pendingOrders = orders.filter((o: any) => o.status === "pending" || !o.isVerified);
        return pendingOrders.length || orders.length; 
      default:
        return 0;
    }
  };

  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((it) => {
        const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
        const Icon = it.icon;
        const badgeCount = getBadgeCount(it.label);
        
        const isEventMenu = it.label === "Event";
        const isKoleksiMenu = it.label === "Daftar Koleksi";
        const showNewBadge = (isEventMenu && !hasVisitedEvent) || (isKoleksiMenu && !hasVisitedKoleksi);

        return (
          <Link
            key={it.to}
            to={it.to}
            onClick={() => handleItemClick(it.label)}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all w-full relative overflow-hidden pr-4",
              active
                ? "bg-primary/15 text-primary shadow-sm font-semibold"
                : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
            )}

            <Icon className={cn("h-4.5 w-4.5 transition-transform shrink-0", active && "scale-105")} />
            <span className="flex-1 text-left">{it.label}</span>
            
            {showNewBadge && (
              <span className="bg-emerald-500 text-white text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-md shrink-0 uppercase shadow-sm animate-pulse">
                New
              </span>
            )}

            {badgeCount > 0 && (
              <span 
                className={cn(
                  "grid place-items-center text-[10px] font-bold h-5 min-w-5 px-1.5 rounded-full shrink-0",
                  active 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-foreground/10 text-foreground/80 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                )}
              >
                {badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const { user, mode, setMode, logout, theme, toggleTheme } = useApp();
  
  // LOGIK MENENTUKAN DAFTAR MENU BERDASARKAN MODE SEKARANG
  const items = mode === "admin" ? adminMenu : mode === "store" ? storeMenu : userMenu;

  // Tombol tukar mode muncul jika dia Owner Toko ATAU dia Super Admin
  const canSwitch = !!user?.isStoreOwner || (user as any)?.role === "super_admin";

  // Fungsi utilitas untuk siklus rotasi 3-Role (User -> Toko -> Admin -> User)
  const handleCycleMode = () => {
    if (mode === "user") {
      setMode("store");
    } else if (mode === "store" && (user as any)?.role === "super_admin") {
      setMode("admin");
    } else {
      setMode("user");
    }
  };

  // Label teks dinamis untuk tombol swap navigasi
  const getSwitchLabel = () => {
    if (mode === "user") return "Switch ke Mode Toko";
    if (mode === "store" && (user as any)?.role === "super_admin") return "Switch ke Super Admin";
    return "Switch ke Mode Penyewa";
  };

  return (
    <div className="flex h-full flex-col">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-5 py-5">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl shadow-soft bg-gradient-to-br transition-colors",
          mode === "admin" ? "from-purple-600 to-purple-400" : "from-primary to-primary/70"
        )}>
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-serif text-lg font-semibold leading-none">PinjamBuku</div>
          <div className={cn(
            "text-[10px] uppercase tracking-[0.18em] font-medium mt-0.5",
            mode === "admin" ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
          )}>
            {mode === "admin" ? "Super Admin" : mode === "store" ? "Mode Toko" : "Modern Library"}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <div className={cn(
          "rounded-xl px-3 py-2 text-[11px] uppercase tracking-wider font-semibold",
          mode === "admin" ? "bg-purple-500/10 text-purple-600" : "bg-foreground/5 text-muted-foreground"
        )}>
          {mode === "admin" ? "Menu Super Admin" : mode === "store" ? "Menu Toko" : "Menu Penyewa"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <NavList items={items} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-border/60 p-3 space-y-2">
        {canSwitch && (
          <button
            onClick={handleCycleMode}
            className={cn(
              "w-full flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
              mode === "admin" 
                ? "border-purple-500/30 bg-purple-500/5 text-purple-600 hover:bg-purple-500/10" 
                : "border-border/70 bg-background/40 hover:bg-primary/10 hover:border-primary/40"
            )}
          >
            <ArrowLeftRight className="h-4 w-4" />
            {getSwitchLabel()}
          </button>
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="ghost" className="flex-1 justify-start rounded-xl" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" /> Keluar
            </Button>
          ) : (
            <Button asChild variant="default" className="flex-1 rounded-xl">
              <Link to="/login" onClick={onNavigate}>
                <LogIn className="h-4 w-4 mr-2" /> Masuk
              </Link>
            </Button>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-2 px-1 pt-1">
            <div className={cn(
              "h-8 w-8 rounded-full text-primary-foreground grid place-items-center text-xs font-semibold bg-gradient-to-br",
              (user as any).role === 'super_admin' ? "from-purple-600 to-indigo-500" : "from-secondary to-primary"
            )}>
              {user.name[0]}
            </div>
            <div className="text-xs leading-tight">
              <div className="font-medium flex items-center gap-1">
                {user.name}
                {(user as any).role === 'super_admin' && <span className="text-[9px] bg-purple-500 text-white px-1 rounded">Admin</span>}
              </div>
              <div className="text-muted-foreground truncate max-w-[140px]">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden lg:flex sticky top-4 h-[calc(100vh-2rem)] w-[272px] shrink-0 ml-4 my-4 flex-col glass rounded-3xl overflow-hidden">
      <SidebarInner />
    </aside>
  );
}

export function MobileTopBar() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="lg:hidden sticky top-0 z-40 glass-strong px-4 py-3 flex items-center gap-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] glass-strong border-0">
          <SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle></SheetHeader>
          <SidebarInner onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
          <BookOpen className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-serif text-base font-semibold">PinjamBuku</span>
      </Link>
    </header>
  );
}