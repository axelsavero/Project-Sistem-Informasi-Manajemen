import { MessageSquareWarning, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <MessageSquareWarning className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">SIPEMA</h3>
                <p className="text-sm opacity-70">
                  Sistem Pengaduan Masyarakat
                </p>
              </div>
            </div>
            <p className="text-sm opacity-70">
              Platform pengaduan masyarakat untuk melaporkan permasalahan
              lingkungan secara mudah, cepat, dan transparan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              <a
                href="tel:+621234567890"
                className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                (021) 1234-5678
              </a>
              <a
                href="mailto:lapor@warga.go.id"
                className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                sipema@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm opacity-70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  Jl. Rawamangun Muka Raya<br />
                  Jakarta, Indonesia
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Jam Operasional</h4>
            <div className="space-y-2 text-sm opacity-70">
              <p>Senin - Jumat: 08:00 - 17:00</p>
              <p>Sabtu: 08:00 - 12:00</p>
              <p>Minggu & Hari Libur: Tutup</p>
            </div>
            <p className="mt-4 text-xs opacity-50">
              Laporan online dapat diajukan 24 jam
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/20 text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} SIPEMA. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
