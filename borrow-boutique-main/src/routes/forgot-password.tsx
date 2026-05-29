import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthShell, Input } from "./login";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell title="Lupa password?" subtitle="Kami akan mengirim tautan reset ke email kamu.">
      {sent ? (
        <div className="text-center space-y-4">
          <div className="text-5xl">✉️</div>
          <p className="text-sm text-muted-foreground">Tautan reset password telah dikirim ke <strong>{email}</strong>. Cek inbox kamu.</p>
          <Link to="/login" className="inline-block text-primary hover:underline text-sm">Kembali ke Login</Link>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Email tidak valid"); setSent(true); toast.success("Tautan reset terkirim"); }} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="kamu@email.com" />
          <Button type="submit" className="w-full h-11 rounded-xl">Kirim Tautan Reset</Button>
          <p className="text-xs text-center text-muted-foreground">Ingat password? <Link to="/login" className="text-primary hover:underline">Masuk</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
