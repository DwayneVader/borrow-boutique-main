import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { AuthShell, Input } from "./login";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>) => ({ store: s.store === "1" || s.store === 1 }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useApp();
  const search = Route.useSearch();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [asStore, setAsStore] = useState(!!search.store);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Nama terlalu pendek");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Email tidak valid");
    if (password.length < 6) return toast.error("Password minimal 6 karakter");
    if (password !== confirm) return toast.error("Konfirmasi password tidak cocok");
    register(name, email, asStore);
    toast.success("Akun berhasil dibuat!");
    nav({ to: "/" });
  };

  return (
    <AuthShell title="Buat akun baru" subtitle="Gratis, hanya butuh beberapa detik.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Nama" value={name} onChange={setName} placeholder="Nama lengkap" />
        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="kamu@email.com" />
        <Input label="Password" type={show ? "text" : "password"} value={password} onChange={setPassword}
          right={<button type="button" onClick={() => setShow(s => !s)} className="text-muted-foreground">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
        />
        <Input label="Konfirmasi Password" type={show ? "text" : "password"} value={confirm} onChange={setConfirm} />
        <label className="flex items-center gap-2 text-sm rounded-xl border border-border bg-background/40 p-3 cursor-pointer hover:border-primary/40">
          <input type="checkbox" checked={asStore} onChange={(e) => setAsStore(e.target.checked)} className="accent-primary" />
          <span>Daftar sebagai <span className="font-medium">pemilik toko buku</span></span>
        </label>
        <Button type="submit" className="w-full h-11 rounded-xl">Daftar</Button>
        <p className="text-xs text-center text-muted-foreground">Sudah punya akun? <Link to="/login" className="text-primary hover:underline">Masuk</Link></p>
      </form>
    </AuthShell>
  );
}
