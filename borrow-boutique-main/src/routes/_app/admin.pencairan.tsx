import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { 
  Landmark, CheckCircle2, XCircle, AlertCircle, 
  Search, ArrowUpRight, ShieldCheck 
} from "lucide-react";
import { stores } from "@/lib/mock-data";
import * as React from "react";

export const Route = createFileRoute("/_app/admin/pencairan")({
  component: AdminPencairanPage,
});

type WithdrawalRequest = {
  id: string;
  orderId: string;
  storeName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
};

function AdminPencairanPage() {
  const { orders } = useApp();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [requests, setRequests] = React.useState<WithdrawalRequest[]>([]);

  React.useEffect(() => {
    // Saring pesanan berstatus "selesai"
    const completedOrders = orders.filter(
      (o) => o.status === "selesai" || (o.status as string) === "completed"
    );

    const savedStatuses = JSON.parse(localStorage.getItem("pinjambuku_withdrawal_statuses") || "{}");

    const mockRequests: WithdrawalRequest[] = completedOrders.map((order, index) => {
      // Uang sewa milik toko = Harga sewa + ongkos kirim awal
      const uangToko = order.rentTotal + order.shipping;
      const currentStatus = savedStatuses[order.id] || "pending";

      // 🟢 PERBAIKAN: Cari nama toko asli dari storeId, bukan text template dummy hiasan
      const realStoreName = stores.find((s) => s.id === order.storeId)?.name || `Toko Buku Mitra ${index + 1}`;

      return {
        id: `WTH-${order.id.replace("ord-", "")}`,
        orderId: order.id,
        storeName: realStoreName, // Menggunakan nama asli
        bankName: index % 2 === 0 ? "BCA" : "Mandiri",
        accountNumber: `xxxx-xxxx-89${index}2`,
        amount: uangToko,
        status: currentStatus,
        date: order.createdAt.slice(0, 10),
      };
    });

    setRequests(mockRequests);
  }, [orders]);

  const handleApprove = (id: string, orderId: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req))
    );

    const savedStatuses = JSON.parse(localStorage.getItem("pinjambuku_withdrawal_statuses") || "{}");
    savedStatuses[orderId] = "approved";
    localStorage.setItem("pinjambuku_withdrawal_statuses", JSON.stringify(savedStatuses));
    
    alert(`⚡ [Super Admin] Otorisasi Berhasil! Dana sewa telah ditransfer ke rekening ${id}`);
  };

  const handleReject = (id: string, orderId: string) => {
    const alasan = prompt("Masukkan alasan penolakan pencairan dana:");
    if (alasan === null) return;

    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req))
    );

    const savedStatuses = JSON.parse(localStorage.getItem("pinjambuku_withdrawal_statuses") || "{}");
    savedStatuses[orderId] = "rejected";
    localStorage.setItem("pinjambuku_withdrawal_statuses", JSON.stringify(savedStatuses));
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPending = requests.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0);
  const totalApproved = requests.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-1 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" /> Otoritas Gerbang Keuangan Global
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Verifikasi Pencairan Dana Toko
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Otorisasi pengiriman uang sewa dari Rekber Rekening Utama ke rekening Bank milik Mitra Toko setelah transaksi sewa buku selesai.
        </p>
      </div>

      {/* Ringkasan Finansial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Total Pending Approval</div>
            <div className="font-serif text-2xl font-semibold mt-1">Rp {totalPending.toLocaleString("id-ID")}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 grid place-items-center">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Dana Berhasil Cair</div>
            <div className="font-serif text-2xl font-semibold mt-1">Rp {totalApproved.toLocaleString("id-ID")}</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 grid place-items-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 sm:col-span-2 lg:col-span-1 border border-purple-500/20 bg-purple-500/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Antrean Request Aktif</div>
            <div className="font-serif text-2xl font-semibold mt-1">{requests.filter(r => r.status === "pending").length} Dokumen</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 grid place-items-center">
            <Landmark className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Searching Bar */}
      <div className="flex items-center max-w-sm rounded-xl border bg-background px-3 py-2 text-sm shadow-inner group transition focus-within:border-purple-500/50">
        <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0 group-focus-within:text-purple-500" />
        <input
          type="text"
          placeholder="Cari nama toko atau ID wd..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground text-xs"
        />
      </div>

      {/* Tabel Kas */}
      <div className="glass rounded-3xl overflow-hidden shadow-soft border border-border/50 bg-background/50 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
                <th className="p-4">ID Penarikan</th>
                <th className="p-4">Info Toko & Rekening</th>
                <th className="p-4">Tanggal Masuk</th>
                <th className="p-4 text-right">Nominal Pencairan</th>
                <th className="p-4 text-center">Status Keandalan</th>
                <th className="p-4 text-right">Aksi Otoritas</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Landmark className="h-8 w-8 text-muted-foreground/50 animate-bounce" />
                      <p className="font-medium">Tidak ada antrean pencairan dana aktif</p>
                      <p className="text-[11px] max-w-xs text-muted-foreground/70">
                        Pencairan otomatis terdata jika ada transaksi sewa buku yang telah diubah statusnya menjadi <b>"Selesai"</b>.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-foreground/90">
                      {req.id}
                      <span className="block text-[10px] font-sans font-normal text-muted-foreground mt-0.5">
                        Ref: {req.orderId}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{req.storeName}</div>
                      <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                        <ArrowUpRight className="h-3 w-3 text-purple-500" /> {req.bankName} — {req.accountNumber}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{req.date}</td>
                    <td className="p-4 text-right font-semibold font-serif text-sm text-foreground">
                      Rp {req.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        req.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : req.status === "rejected"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          req.status === "approved" ? "bg-emerald-500" : req.status === "rejected" ? "bg-rose-500" : "bg-amber-500"
                        }`} />
                        {req.status === "approved" ? "Selesai Ditransfer" : req.status === "rejected" ? "Ditolak Admin" : "Menunggu Verifikasi"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {req.status === "pending" ? (
                        <div className="flex gap-1.5 justify-end">
                          <Button 
                            size="sm" 
                            className="h-7 text-[10px] rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
                            onClick={() => handleApprove(req.id, req.orderId)}
                          >
                            Setujui
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-[10px] rounded-lg border-rose-500/20 text-rose-600 hover:bg-rose-500/5"
                            onClick={() => handleReject(req.id, req.orderId)}
                          >
                            Tolak
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic font-sans">
                          Tandai Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}