import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { complaintAPI } from "@/lib/api";
import {
  Search,
  FileSearch,
  Calendar,
  MapPin,
  Tag,
  MessageSquare,
  ImageIcon,
  LogIn,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const categoryLabels: Record<string, string> = {
  jalan_rusak: "Jalan Rusak",
  sampah: "Sampah Menumpuk",
  penerangan: "Penerangan Jalan Mati",
  saluran_air: "Saluran Air Tersumbat",
  fasilitas_umum: "Fasilitas Umum Rusak",
  lainnya: "Lainnya",
};

interface Complaint {
  id: number;
  ticket_number: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  description: string;
  image_url?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export default function Tracking() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [ticketNumber, setTicketNumber] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setSearched(false);

    try {
      const result = await complaintAPI.findByTicket(ticketNumber.trim());
      setComplaint(result);
      setSearched(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setComplaint(null);
        setSearched(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto border-2 border-primary">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Login Diperlukan
              </h2>
              <p className="text-muted-foreground mb-6">
                Anda harus login terlebih dahulu untuk melacak status laporan.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => navigate("/login")} className="flex-1">
                  Login
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate("/register")}
                  className="flex-1"
                >
                  Daftar Akun
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Lacak Laporan
            </h1>
            <p className="text-muted-foreground">
              Masukkan nomor tiket untuk melihat status laporan Anda
            </p>
          </div>

          <Card className="border-2 mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  placeholder="Masukkan nomor tiket (contoh: LP241205-ABC123)"
                  value={ticketNumber}
                  onChange={(e) =>
                    setTicketNumber(e.target.value.toUpperCase())
                  }
                  className="font-mono text-lg"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !ticketNumber.trim()}
                >
                  {isLoading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searched && !complaint && (
            <Card className="border-2 border-destructive/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <FileSearch className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Laporan Tidak Ditemukan
                </h3>
                <p className="text-muted-foreground">
                  Tidak ada laporan dengan nomor tiket "{ticketNumber}".
                  Pastikan nomor tiket yang Anda masukkan benar.
                </p>
              </CardContent>
            </Card>
          )}

          {complaint && (
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-mono text-xl">
                      {complaint.ticket_number}
                    </CardTitle>
                    <CardDescription>
                      Dilaporkan pada{" "}
                      {format(
                        new Date(complaint.created_at),
                        "dd MMMM yyyy, HH:mm",
                        { locale: id }
                      )}
                    </CardDescription>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Timeline */}
                <div className="bg-secondary p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">
                    Status Terkini
                  </h4>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={complaint.status} />
                    <span className="text-sm text-muted-foreground">
                      Terakhir diperbarui:{" "}
                      {format(
                        new Date(complaint.updated_at),
                        "dd MMM yyyy, HH:mm",
                        { locale: id }
                      )}
                    </span>
                  </div>
                  {complaint.admin_notes && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Catatan Petugas:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {complaint.admin_notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detail Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">
                    Detail Laporan
                  </h4>

                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Kategori
                        </p>
                        <p className="font-medium text-foreground">
                          {categoryLabels[complaint.category]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lokasi</p>
                        <p className="font-medium text-foreground">
                          {complaint.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Deskripsi
                        </p>
                        <p className="text-foreground">
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    {complaint.image_url && (
                      <div className="flex items-start gap-3">
                        <ImageIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Foto Pendukung
                          </p>
                          <img
                            src={complaint.image_url}
                            alt="Foto pengaduan"
                            className="max-h-64 rounded-lg border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Legend */}
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    Keterangan Status:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <span>Menunggu - Laporan sedang diperiksa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-info" />
                      <span>Diproses - Sedang ditangani</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      <span>Selesai - Masalah telah ditangani</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span>Ditolak - Tidak dapat diproses</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
