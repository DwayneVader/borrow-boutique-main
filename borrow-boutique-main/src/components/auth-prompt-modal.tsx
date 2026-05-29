import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function AuthPromptModal() {
  const { authPrompt, closeAuthPrompt } = useApp();
  return (
    <Dialog open={authPrompt.open} onOpenChange={(v) => !v && closeAuthPrompt()}>
      <DialogContent className="glass-strong border-0 sm:max-w-md rounded-3xl">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl">Login dulu, yuk</DialogTitle>
          <DialogDescription className="text-center">
            {authPrompt.reason
              ? `Kamu perlu masuk untuk: ${authPrompt.reason}.`
              : "Fitur ini hanya tersedia untuk pengguna terdaftar."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-2">
          <Button asChild className="rounded-xl h-11" onClick={closeAuthPrompt}>
            <Link to="/login">Masuk ke Akun</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl h-11" onClick={closeAuthPrompt}>
            <Link to="/register">Buat Akun Baru</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
