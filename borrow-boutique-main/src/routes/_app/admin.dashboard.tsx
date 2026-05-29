import { createFileRoute } from "@tanstack/react-router";
import { 
  TrendingUp, 
  Users, 
  Store, 
  BookOpen, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock 
} from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/_app/admin/dashboard")({
  component: DashboardGlobalPage,
});

function DashboardGlobalPage() {
  // Data Ringkasan Statistik Utama
  const stats = [
    { title: "Total Pengguna", value: "1,248", change: "+12% bulan ini", isUp: true, icon: Users, color: "text-blue-600 bg-blue-500/10" },
    { title: "Mitra Toko Aktif", value: "42", change: "+4 baru minggu ini", isUp: true, icon: Store, color: "text-purple-600 bg-purple-500/10" },
    { title: "Buku Terkatalog", value: "3,850", change: "-2% buku rusak", isUp: false, icon: BookOpen, color: "text-amber-600 bg-amber-500/10" },
    { title: "Total Pendapatan", value: "Rp 24.500.000", change: "+18% dari target", isUp: true, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
  ];

  // Data Log Aktivitas Terbaru Sistem
  const aktivitasTerbaru = [
    { id: 1, tipe: "Pendaftaran Toko", pesan: "Toko 'Buku Mulia Malang' mendaftarkan kemitraan baru.", waktu: "10 menit yang lalu" },
    { id: 2, tipe: "Upload Buku", pesan: "Gles Bookstore mengupload buku 'Atomic Habits'.", waktu: "1 jam yang lalu" },
    { id: 3, tipe: "Pencairan Dana", pesan: "Pencairan dana Rp 450.000 sukses untuk Toko Kitab Kuning.", waktu: "3 jam yang lalu" },
    { id: 4, tipe: "User Report", pesan: "Akun USR-99 diblokir sementara karena indikasi spamming.", waktu: "Yesterday" },
  ];

  return (
    <div className="p-1 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Dashboard Global</h1>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan matriks performa sistem dan pemantauan aktivitas PinjamBuku secara real-time.</p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div key={i} className="glass rounded-2xl p-5 shadow-soft border border-border/60 bg-background/50 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</h3>
                <div className="flex items-center gap-1 text-xs">
                  {stat.isUp ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-rose-600" />
                  )}
                  <span className={stat.isUp ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Konten Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolon Kiri: Tren & Grafik Simulasi */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h2 className="font-serif text-lg font-semibold">Grafik Pertumbuhan Transaksi</h2>
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded-lg text-muted-foreground font-mono">Live Update</span>
          </div>
          
          {/* Box Simulasi Tampilan Chart */}
          <div className="h-64 border border-dashed rounded-2xl bg-muted/10 flex flex-col items-center justify-center p-4 text-center">
            <div className="flex items-end gap-2 w-full h-36 px-4 justify-between max-w-md">
              <div className="w-full bg-purple-200 rounded-t-lg h-[40%]"></div>
              <div className="w-full bg-purple-300 rounded-t-lg h-[55%]"></div>
              <div className="w-full bg-purple-400 rounded-t-lg h-[45%]"></div>
              <div className="w-full bg-purple-300 rounded-t-lg h-[70%]"></div>
              <div className="w-full bg-purple-500 rounded-t-lg h-[60%]"></div>
              <div className="w-full bg-purple-600 rounded-t-lg h-[90%]"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 font-medium">Tren Penyewaan Buku 6 Bulan Terakhir (Jan - Jun 2026)</p>
          </div>
        </div>

        {/* Kolon Kanan: Log Aktivitas Sistem */}
        <div className="glass rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Clock className="h-5 w-5 text-purple-600" />
            <h2 className="font-serif text-lg font-semibold">Sistem Log Terbaru</h2>
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {aktivitasTerbaru.map((log) => (
              <div key={log.id} className="text-xs space-y-1 border-l-2 border-purple-500/40 pl-3 py-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[10px]">{log.tipe}</span>
                  <span className="text-muted-foreground text-[10px]">{log.waktu}</span>
                </div>
                <p className="text-muted-foreground/90 leading-relaxed">{log.pesan}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}