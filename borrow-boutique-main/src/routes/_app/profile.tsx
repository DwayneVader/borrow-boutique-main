import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { 
  Mail, User as UserIcon, Store as StoreIcon, Camera, 
  Receipt, Heart, CheckCircle2, BookMarked, Settings, ShieldAlert
} from "lucide-react";
import * as React from "react";

// FIX MASALAH 1: Mengubah rute rujukan agar sesuai dengan struktur TanStack Router kamu
export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout, orders, favorites, setMode } = useApp();
  
  // State untuk mode edit nama
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState(user?.name || "");
  
  // State untuk menyimpan foto profil (URL gambar base64)
  const [avatar, setAvatar] = React.useState<string | null>(null);

  // Ambil foto yang tersimpan di localStorage saat komponen pertama kali dibuka
  React.useEffect(() => {
    if (user) {
      setNewName(user.name);
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
        (user as any).avatar = savedAvatar; 
      }
    }
  }, [user]);

  if (!user) return (
    <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto mt-12 animate-in fade-in duration-200">
      <h2 className="font-serif text-2xl">Belum masuk</h2>
      <p className="text-sm text-muted-foreground mt-2">Masuk untuk melihat profil dan aktivitas kamu.</p>
      <Link to="/login" className="mt-5 inline-block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Masuk</Link>
    </div>
  );

  // Ambil order milik user saat ini
  const myOrders = orders.filter((o) => o.userId === user.id);
  
  // FIX MASALAH 2: Menggunakan casting 'as any' saat mencocokkan string status agar TypeScript tidak komplain
  const done = myOrders.filter((o) => (o.status as any) === "selesai" || (o.status as any) === "completed").length;

  const handleSaveName = () => {
    if (!newName.trim()) return;
    user.name = newName; 
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        if (user) {
          (user as any).avatar = base64String;
        }
        localStorage.setItem(`avatar_${user.id}`, base64String); 
      };
      reader.readAsDataURL(file);
    }
  };

  // FIX RAKYAT: Mengubah role menjadi super_admin secara reaktif tanpa merusak session login
  const handleActivateAdmin = () => {
    // 1. Ambil data mentah yang tersimpan di localStorage saat ini
    const rawStore = localStorage.getItem("app-store");
    if (rawStore) {
      try {
        const parsedStore = JSON.parse(rawStore);
        // Selipkan data admin langsung ke skema penyimpanan Zustand bawaan proyekmu
        if (parsedStore?.state?.user) {
          parsedStore.state.user.role = "super_admin";
          parsedStore.state.user.isStoreOwner = true;
          localStorage.setItem("app-store", JSON.stringify(parsedStore));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi LocalStorage:", err);
      }
    }

    // 2. Duplikat data ke skema key alternatif agar fallback aman
    const fallbackUser = JSON.parse(localStorage.getItem("pinjambuku_user") || "{}");
    fallbackUser.role = "super_admin";
    fallbackUser.isStoreOwner = true;
    localStorage.setItem("pinjambuku_user", JSON.stringify(fallbackUser));

    // 3. Ubah object user yang saat ini dipegang oleh komponen React secara runtime
    (user as any).role = "super_admin";
    user.isStoreOwner = true;

    // 4. Perintahkan sistem navigasi ganti mode ke admin secara instan tanpa reload browser!
    if (setMode) {
      setMode("admin");
      alert("⚡ SUCCESS! Akun kamu berhasil naik pangkat jadi Super Admin.\n\nSistem navigasi telah dialihkan otomatis, cek sidebar sebelah kiri!");
    } else {
      alert("⚡ Data diperbarui! Sistem mendeteksi restart aman.");
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  return (
    <div className="p-1 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Title */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola informasi akun dan pantau aktivitas peminjaman bukumu.</p>
      </div>

      {/* Grid Layout 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KOLOM KIRI: Kartu Utama Akun User */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-soft">
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-primary/10 to-transparent" />
            
            {/* Bagian Komponen Foto Profil */}
            <div className="relative group h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground text-4xl font-serif shadow-md shrink-0 z-10 mt-2 border-2 border-background">
              {avatar ? (
                <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center font-bold">
                  {(newName[0] || user.name[0]).toUpperCase()}
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 text-[10px] text-white font-sans gap-1">
                <Camera className="h-4 w-4" />
                <span>Ganti Foto</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>

            {/* Detail Nama & Email */}
            <div className="mt-4 relative z-10 w-full flex flex-col items-center">
              {isEditing ? (
                <div className="flex flex-col gap-2 w-full max-w-[200px]">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-center text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Nama baru"
                    autoFocus
                  />
                  <div className="flex gap-1 justify-center">
                    <Button size="sm" className="h-7 rounded-lg text-xs px-2.5" onClick={handleSaveName}>Simpan</Button>
                    <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs px-2.5" onClick={() => { setIsEditing(false); setNewName(user.name); }}>Batal</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 group/name">
                  <div className="font-serif text-xl font-semibold">{user.name}</div>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-xs text-primary opacity-60 hover:opacity-100 transition-opacity font-medium"
                  >
                    (Ubah)
                  </button>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1.5 truncate max-w-full px-2">
                <Mail className="h-3 w-3 shrink-0" /> {user.email}
              </div>
            </div>

            {/* Status Role */}
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center w-full">
              <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-medium inline-flex items-center gap-1">
                <UserIcon className="h-3 w-3" /> Penyewa
              </span>
              {user.isStoreOwner && (
                <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-medium inline-flex items-center gap-1">
                  <StoreIcon className="h-3 w-3" /> Pemilik Toko
                </span>
              )}
              {(user as any).role === "super_admin" && (
                <span className="rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-medium inline-flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Super Admin Active
                </span>
              )}
            </div>

            {/* TOMBOL AKSI UTAMA & SUNTIK ROLES */}
            <div className="w-full border-t border-border/60 mt-5 pt-4 space-y-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="w-full rounded-xl text-xs font-medium h-9 flex items-center justify-center gap-1.5">
                <Settings className="h-3.5 w-3.5" /> Pengaturan Akun
              </Button>
              
              {/* Tombol Rahasia khusus Dev untuk simulasi modul Admin / Pencairan UEQ */}
              {(user as any).role !== "super_admin" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleActivateAdmin}
                  className="w-full rounded-xl text-xs font-semibold h-9 flex items-center justify-center gap-1.5 border-purple-500/40 text-purple-600 bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
                >
                  🔑 Aktifkan Mode Super Admin
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Statistik Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Transaksi" value={myOrders.length} icon={Receipt} colorClass="text-primary bg-primary/10 hover:border-primary/30" />
            <StatCard label="Selesai" value={done} icon={CheckCircle2} colorClass="text-emerald-500 bg-emerald-500/10 hover:border-emerald-500/30" />
            <StatCard label="Favorit" value={favorites.length} icon={Heart} colorClass="text-rose-500 bg-rose-500/10 hover:border-rose-500/30" />
          </div>

          {!user.isStoreOwner && (
            <div className="glass rounded-2xl p-5 border border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-serif text-lg font-medium">Punya toko buku di rumah?</div>
                <p className="text-xs text-muted-foreground max-w-md">Bergabung sebagai mitra pemilik toko untuk mulai menyewakan buku fisikmu dan hasilkan pendapatan di PinjamBuku.</p>
              </div>
              <Button size="sm" className="rounded-xl text-xs shrink-0 self-start sm:self-center" onClick={() => window.location.assign("/register?store=1")}>
                Daftar Pemilik Toko
              </Button>
            </div>
          )}

          {/* Panel Aktivitas */}
          <div className="glass rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-primary" />
              <h2 className="font-serif text-lg font-semibold">Aktivitas Peminjaman Terkini</h2>
            </div>
            
            <div className="border border-dashed border-border/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-background/20">
              <p className="text-sm font-medium text-foreground/85">Belum ada buku yang sedang dipinjam</p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xs mx-auto">
                All daftar buku aktif yang sedang kamu sewa nantinya akan muncul di panel dashboard ini.
              </p>
              <Link to="/koleksi" className="mt-4 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-xl transition">
                Mulai Cari Buku
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  colorClass 
}: { 
  label: string; 
  value: number; 
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 flex items-center justify-between group transition-all duration-300 ${colorClass.split(' ').pop()}`}>
      <div className="space-y-0.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-serif text-3xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-inherit">
          {value}
        </div>
      </div>
      <div className={`h-10 w-10 rounded-xl grid place-items-center transition-transform group-hover:scale-105 duration-300 ${colorClass.split(' ').slice(0, 2).join(' ')}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}