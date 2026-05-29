import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Phone, Instagram, FileText, Clock, Flame } from "lucide-react";
import { events } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/event")({
  component: EventPage,
});

// Fungsi pembantu untuk mengubah format tanggal kaku (YYYY-MM-DD) menjadi (DD Bulan YYYY)
function formatTanggalIndo(dateString: string) {
  try {
    const opsi: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', opsi);
  } catch {
    return dateString; // Jika error, balikin format aslinya
  }
}

function EventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Event Literasi</h1>
        <p className="text-sm text-muted-foreground mt-1">Papan informasi komunitas pembaca seluruh Indonesia.</p>
      </div>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {events.map((e) => {
          // Trik dinamis jika data form & ig belum ada di mock-data.ts
          const googleFormUrl = (e as any).formUrl || "https://forms.google.com";
          const instagramUser = (e as any).instagram || "pinjambuku.id";
          const eventTime = (e as any).time || "19:00 WIB"; // Default jam jika belum ada

          return (
            <div key={e.id} className="glass rounded-3xl overflow-hidden book-card flex flex-col group transition-all duration-300 hover:shadow-lg">
              {/* Bagian Poster */}
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={e.poster} alt={e.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {/* Badge Status di pojok poster */}
                <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-[10px] font-medium px-2.5 py-1 rounded-full text-foreground shadow-sm">
                  🟢 Terbuka
                </span>
              </div>
              
              {/* Bagian Konten */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-serif text-xl leading-snug group-hover:text-primary transition-colors">{e.title}</h3>
                
                {/* Baris Meta Info (Waktu, Tempat, Media Sosial) */}
                <div className="flex flex-col gap-1.5 border-b border-foreground/5 pb-3">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary/70" />
                      {formatTanggalIndo(e.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary/70" />
                      {eventTime}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary/70" />
                      {e.city}
                    </span>
                    <a 
                      href={`https://instagram.com/${instagramUser}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline transition-all"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      @{instagramUser}
                    </a>
                  </div>
                </div>

                {/* Deskripsi */}
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{e.description}</p>
                
                {/* Info Kelangkaan / Urgensi Psikologis (FOMO) */}
                <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 mt-1">
                  <Flame className="h-3.5 w-3.5 animate-pulse" />
                  Slot Terbatas! Segera amankan kursimu.
                </div>

                {/* Grid Dua Tombol yang Dipertajam Hierarkinya */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-3">
                  <Button asChild variant="outline" className="rounded-xl border-foreground/20 hover:bg-foreground/5 text-muted-foreground hover:text-foreground">
                    <a href={`https://wa.me/${e.contact.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                      <Phone className="h-4 w-4 mr-1.5 shrink-0" /> Hubungi
                    </a>
                  </Button>
                  
                  <Button asChild className="rounded-xl font-medium shadow-sm">
                    <a href={googleFormUrl} target="_blank" rel="noreferrer">
                      <FileText className="h-4 w-4 mr-1.5 shrink-0" /> Isi Form
                    </a>
                  </Button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}