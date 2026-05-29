import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [asStore, setAsStore] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Email tidak valid");
    if (password.length < 6) return toast.error("Password minimal 6 karakter");
    login(email, email.split("@")[0], asStore);
    toast.success("Selamat datang kembali!");
    nav({ to: "/" });
  };

  return (
    <AuthShell title="Masuk ke akunmu" subtitle="Lanjutkan perjalanan membacamu di PinjamBuku.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="kamu@email.com" />
        <Input label="Password" type={show ? "text" : "password"} value={password} onChange={setPassword} placeholder="••••••••"
          right={<button type="button" onClick={() => setShow(s => !s)} className="text-muted-foreground">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={asStore} onChange={(e) => setAsStore(e.target.checked)} className="accent-primary" />
          Masuk sebagai pemilik toko (demo)
        </label>
        <Button type="submit" className="w-full h-11 rounded-xl">Masuk</Button>
        <div className="flex justify-between text-xs">
          <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Lupa password?</Link>
          <Link to="/register" className="text-primary hover:underline">Buat akun baru</Link>
        </div>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative items-end p-12 overflow-hidden bg-gradient-to-br from-secondary/30 via-primary/10 to-background">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
          alt="library"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 grid place-items-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl">PinjamBuku</span>
          </Link>
          <h2 className="font-serif text-4xl leading-tight max-w-md">Buku fisik, dikirim ke pintu rumahmu.</h2>
          <p className="text-muted-foreground mt-3 max-w-md">Toko independen tepercaya. Rekber, deposito aman, pengembalian terjamin.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="glass-strong w-full max-w-md rounded-3xl p-8">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 grid place-items-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl">PinjamBuku</span>
          </Link>
          <h1 className="font-serif text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Input({ label, type = "text", value, onChange, placeholder, right }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; right?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</label>
      <div className="mt-1 flex items-center rounded-xl bg-background/60 border border-border focus-within:border-primary/60 transition px-3">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none py-2.5 text-sm"
        />
        {right}
      </div>
    </div>
  );
}
