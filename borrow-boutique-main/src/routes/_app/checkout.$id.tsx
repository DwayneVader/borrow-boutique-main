import { createFileRoute, useNavigate, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { couriers, formatIDR, stores, PLATFORM_BANK } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Check, Calendar, MapPin, Wallet, Upload, ChevronLeft, ShieldCheck, Copy, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/checkout/$id")({
  component: CheckoutPage,
});

const steps = ["Konfigurasi Sewa", "Alamat & Ekspedisi", "Rincian Biaya", "Pembayaran"];

function CheckoutPage() {
  const { id } = Route.useParams();
  const { books, user, requireAuth, createOrder, removeFromCart } = useApp();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === id);
  if (!book) throw notFound();
  const store = stores.find((s) => s.id === book.storeId)!;

  if (!user) {
    requireAuth("Checkout");
    return (
      <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto mt-12">
        <h2 className="font-serif text-2xl">Masuk untuk melanjutkan checkout</h2>
        <Link to="/login" className="mt-5 inline-block rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Masuk</Link>
      </div>
    );
  }

  const [step, setStep] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState(7);
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [courierId, setCourierId] = useState(couriers[0].id);
  const [proof, setProof] = useState<string | null>(null);

  const courier = couriers.find((c) => c.id === courierId)!;
  const distance = city && city.toLowerCase() !== store.city.toLowerCase() ? 1.5 : 1;
  const shipping = Math.round(courier.base * distance);
  const rentTotal = book.pricePerDay * duration;
  const total = rentTotal + shipping + book.deposit;

  const next = () => {
    if (step === 0 && duration < 1) return toast.error("Durasi minimal 1 hari");
    if (step === 1) {
      if (!recipientName) return toast.error("Nama penerima wajib diisi");
      if (!address || !city) return toast.error("Alamat dan kota wajib diisi");
    }
    if (step === 3 && !proof) return toast.error("Upload bukti pembayaran terlebih dahulu");
    if (step === 3) {
      createOrder({
        bookId: book.id, 
        userId: user.id, 
        storeId: book.storeId,
        startDate, 
        durationDays: duration, 
        address: `Penerima: ${recipientName}, Alamat: ${address}, ${city}`,
        courier: courier.name, 
        shipping, 
        rentTotal, 
        deposit: book.deposit, 
        total,
        paymentProof: proof ?? undefined,
      });
      removeFromCart(book.id);
      toast.success("Pesanan dibuat! Menunggu verifikasi toko.");
      navigate({ to: "/transaksi" });
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/buku/$id" params={{ id: book.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kembali ke detail buku
      </Link>

      <div className="glass-strong rounded-3xl p-6">
        <h1 className="font-serif text-2xl mb-1">Checkout</h1>
        <p className="text-sm text-muted-foreground">{book.title} · {store.name}</p>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={cn("h-9 w-9 shrink-0 rounded-full grid place-items-center text-xs font-semibold",
                i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-muted-foreground")}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <div className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</div>
              </div>
              {i < steps.length - 1 && <div className={cn("flex-1 h-0.5 rounded", i < step ? "bg-success" : "bg-border")} />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4 min-h-[280px]">
            {step === 0 && (
              <div className="space-y-4">
                <Field label="Tanggal mulai sewa" icon={<Calendar className="h-4 w-4" />}>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-glass" />
                </Field>
                <Field label="Durasi sewa (hari)">
                  <div className="flex gap-2">
                    {[3, 7, 14, 21, 30].map((d) => (
                      <button key={d} onClick={() => setDuration(d)}
                        className={cn("rounded-xl border px-4 py-2 text-sm font-medium",
                          duration === d ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50")}
                      >
                        {d} hari
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                {/* Input Nama Penerima Baru */}
                <Field label="Nama Penerima" icon={<User className="h-4 w-4" />}>
                  <input 
                    type="text" 
                    value={recipientName} 
                    onChange={(e) => setRecipientName(e.target.value)} 
                    placeholder="Masukkan nama lengkap penerima..." 
                    className="input-glass" 
                  />
                </Field>

                {/* Input Alamat Lengkap + Keterangan Instruksi Detail */}
                <Field label="Alamat lengkap" icon={<MapPin className="h-4 w-4" />}>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Tulis nama jalan, nomor rumah, RT/RW, Dusun, Kelurahan, Kecamatan, dan KODE POS secara lengkap..." 
                    className="input-glass min-h-[100px]" 
                  />
                  <p className="text-[11px] text-muted-foreground italic mt-1.5 px-1">
                    *Mohon cantumkan patokan detail rumah dan Kode Pos agar kurir ekspedisi tidak salah kirim.
                  </p>
                </Field>

                <Field label="Kota">
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="cth: Jakarta" className="input-glass" />
                </Field>

                <Field label="Ekspedisi">
                  <div className="grid sm:grid-cols-3 gap-2">
                    {couriers.map((c) => (
                      <button key={c.id} onClick={() => setCourierId(c.id)}
                        className={cn("text-left rounded-xl border p-3",
                          courierId === c.id ? "border-primary bg-primary/5" : "border-border")}
                      >
                        <div className="font-medium text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.days}</div>
                        <div className="text-xs text-primary mt-1">mulai {formatIDR(c.base)}</div>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="glass rounded-2xl p-5 space-y-3 text-sm">
                <Row label={`Biaya sewa (${formatIDR(book.pricePerDay)} × ${duration} hari)`} value={formatIDR(rentTotal)} />
                <Row label={`Ongkos kirim (${courier.name})`} value={formatIDR(shipping)} />
                <Row label="Deposito / jaminan buku" value={formatIDR(book.deposit)} />
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-serif text-lg">
                  <span>Total Pembayaran</span><span className="text-primary">{formatIDR(total)}</span>
                </div>
                <div className="mt-4 rounded-xl bg-secondary/10 border border-secondary/30 p-3 text-xs text-secondary flex gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Deposito akan ditahan oleh Rekber PinjamBuku dan dikembalikan 100% setelah buku diverifikasi aman oleh toko.</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs uppercase text-muted-foreground">Transfer ke Rekber PinjamBuku</div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-serif text-2xl">{PLATFORM_BANK.bank} · {PLATFORM_BANK.number}</div>
                      <div className="text-xs text-muted-foreground mt-1">a.n. {PLATFORM_BANK.holder}</div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { navigator.clipboard.writeText(PLATFORM_BANK.number); toast.success("Nomor rekening disalin"); }}>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Salin
                    </Button>
                  </div>
                  <div className="mt-4 flex justify-between font-serif text-lg">
                    <span>Total transfer</span><span className="text-primary">{formatIDR(total)}</span>
                  </div>
                </div>

                <Field label="Upload bukti transfer" icon={<Upload className="h-4 w-4" />}>
                  <label className={cn("flex items-center justify-center rounded-2xl border-2 border-dashed p-6 cursor-pointer text-sm",
                    proof ? "border-success bg-success/5 text-success" : "border-border hover:border-primary/50 text-muted-foreground")}>
                    <input type="file" accept="image/*" hidden onChange={(e) => {
                      const f = e.target.files?.[0]; if (!f) return;
                      const r = new FileReader();
                      r.onload = () => setProof(String(r.result));
                      r.readAsDataURL(f);
                    }} />
                    {proof ? "✓ Bukti pembayaran terunggah" : "Klik untuk pilih file gambar"}
                  </label>
                </Field>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="rounded-xl">Sebelumnya</Button>
              <Button onClick={next} className="rounded-xl px-6">{step === 3 ? "Submit Pembayaran" : "Lanjut"}</Button>
            </div>
          </div>

          {/* Summary */}
          <aside className="glass rounded-2xl p-4 h-fit sticky top-4">
            <div className="flex gap-3">
              <img src={book.cover} alt={book.title} className="h-24 w-18 object-cover rounded-xl" />
              <div>
                <div className="font-serif text-base leading-snug">{book.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{store.name} · {store.city}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <Row label="Sewa" value={formatIDR(rentTotal)} small />
              <Row label="Ongkir" value={formatIDR(shipping)} small />
              <Row label="Deposito" value={formatIDR(book.deposit)} small />
              <div className="border-t border-border pt-2 flex justify-between text-sm">
                <span className="font-medium">Total</span>
                <span className="font-serif text-primary text-base">{formatIDR(total)}</span>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-primary/10 text-primary text-xs p-3 flex gap-2">
              <Wallet className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              Denda keterlambatan Rp5.000/hari otomatis dipotong dari deposito.
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .input-glass {
          width: 100%;
          background: color-mix(in oklab, var(--color-background) 60%, transparent);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 0.6rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .2s;
        }
        .input-glass:focus { border-color: color-mix(in oklab, var(--color-primary) 60%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {icon}{label}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-3", small ? "text-xs" : "text-sm")}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}