import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/lib/app-store";
import { AuthPromptModal } from "@/components/auth-prompt-modal";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-10 text-center">
        <div className="font-serif text-7xl text-primary">404</div>
        <h2 className="mt-3 font-serif text-xl">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Buku yang kamu cari tidak ada di rak ini.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-10 text-center">
        <h1 className="font-serif text-xl">Halaman gagal dimuat</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ada yang tidak beres. Coba muat ulang.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Coba lagi</button>
          <a href="/" className="rounded-xl border border-border px-4 py-2 text-sm font-medium">Beranda</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PinjamBuku — Marketplace Sewa Buku Fisik" },
      { name: "description", content: "Sewa buku fisik dari toko buku independen tepercaya. Rekber, pengiriman aman, deposito kembali utuh." },
      { name: "author", content: "PinjamBuku" },
      { property: "og:title", content: "PinjamBuku — Digital Library, Buku Fisik" },
      { property: "og:description", content: "Sewa buku fisik dari toko independen seluruh Indonesia." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Outlet />
        <AuthPromptModal />
        <Toaster position="top-center" richColors />
      </AppProvider>
    </QueryClientProvider>
  );
}
