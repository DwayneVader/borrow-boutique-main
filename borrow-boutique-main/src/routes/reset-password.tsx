import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthShell, Input } from "./login";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
});

function ResetPage() {
  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const nav = useNavigate();
  return (
    <AuthShell title="Reset Password" subtitle="Buat password baru untuk akunmu.">
      <form onSubmit={(e) => {
        e.preventDefault();
        if (p.length < 6) return toast.error("Password minimal 6 karakter");
        if (p !== c) return toast.error("Konfirmasi tidak cocok");
        toast.success("Password berhasil diperbarui");
        nav({ to: "/login" });
      }} className="space-y-4">
        <Input label="Password Baru" type="password" value={p} onChange={setP} />
        <Input label="Konfirmasi" type="password" value={c} onChange={setC} />
        <Button type="submit" className="w-full h-11 rounded-xl">Simpan</Button>
        <p className="text-xs text-center text-muted-foreground"><Link to="/login" className="text-primary hover:underline">Kembali ke Login</Link></p>
      </form>
    </AuthShell>
  );
}
