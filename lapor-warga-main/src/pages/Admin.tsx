import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { complaintAPI } from "@/lib/api";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  Edit,
  FileText,
  RefreshCw,
  Loader2,
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

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  in_progress: "Diproses",
  completed: "Selesai",
  rejected: "Ditolak",
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

export default function Admin() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    rejected: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<string>("pending");
  const [editNotes, setEditNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load complaints with filter
      const params: any = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const [complaintsData, statsData] = await Promise.all([
        complaintAPI.getAll(params),
        complaintAPI.getStats(),
      ]);

      setComplaints(complaintsData.data || complaintsData);
      setStats(statsData.stats);
    } catch (error) {
      toast({
        title: "Gagal Memuat Data",
        description: "Terjadi kesalahan saat memuat data laporan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearch = () => {
    loadData();
  };

  const handleViewDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailOpen(true);
  };

  const handleEditClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setEditStatus(complaint.status);
    setEditNotes(complaint.admin_notes || "");
    setIsEditOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      await complaintAPI.update(selectedComplaint.id, {
        status: editStatus,
        admin_notes: editNotes,
      });

      toast({
        title: "Status Berhasil Diperbarui",
        description: `Laporan ${selectedComplaint.ticket_number} telah diperbarui`,
      });

      setIsEditOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: "Gagal Memperbarui Status",
        description: "Terjadi kesalahan saat memperbarui status laporan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard Admin
              </h1>
              <p className="text-muted-foreground">
                Kelola dan pantau laporan pengaduan masyarakat
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Laporan
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Menunggu
                  </p>
                  <p className="text-2xl font-bold text-warning">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Diproses
                  </p>
                  <p className="text-2xl font-bold text-info">
                    {stats.in_progress}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Selesai
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ditolak
                  </p>
                  <p className="text-2xl font-bold text-destructive">
                    {stats.rejected}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Laporan</CardTitle>
            <CardDescription>
              Gunakan filter untuk mempersempit pencarian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan nomor tiket, nama, atau alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="in_progress">Diproses</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="w-full md:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
              <Button
                variant="outline"
                onClick={loadData}
                className="w-full md:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Laporan</CardTitle>
            <CardDescription>
              Menampilkan {complaints.length} laporan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Tidak ada laporan ditemukan
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nomor Tiket</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-mono">
                          {complaint.ticket_number}
                        </TableCell>
                        <TableCell>{complaint.name}</TableCell>
                        <TableCell>
                          {categoryLabels[complaint.category]}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {complaint.address}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={complaint.status} />
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(complaint.created_at),
                            "dd MMM yyyy",
                            { locale: id }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetail(complaint)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditClick(complaint)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Laporan</DialogTitle>
            <DialogDescription>
              Informasi lengkap laporan {selectedComplaint?.ticket_number}
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Tiket</p>
                  <p className="font-mono font-medium">
                    {selectedComplaint.ticket_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedComplaint.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nama Pelapor</p>
                  <p className="font-medium">{selectedComplaint.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedComplaint.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">No. HP</p>
                  <p className="font-medium">{selectedComplaint.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="font-medium">
                    {categoryLabels[selectedComplaint.category]}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Alamat Lokasi
                </p>
                <p className="font-medium">{selectedComplaint.address}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Deskripsi Masalah
                </p>
                <p className="text-sm">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.image_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Foto Pendukung
                  </p>
                  <img
                    src={selectedComplaint.image_url}
                    alt="Foto laporan"
                    className="max-h-64 rounded-lg border"
                  />
                </div>
              )}

              {selectedComplaint.admin_notes && (
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Catatan Admin
                  </p>
                  <p className="text-sm">{selectedComplaint.admin_notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Dibuat pada</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedComplaint.created_at),
                      "dd MMMM yyyy, HH:mm",
                      { locale: id }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Terakhir diperbarui</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedComplaint.updated_at),
                      "dd MMMM yyyy, HH:mm",
                      { locale: id }
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Laporan</DialogTitle>
            <DialogDescription>
              Ubah status dan tambahkan catatan untuk laporan{" "}
              {selectedComplaint?.ticket_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="in_progress">Diproses</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Catatan (opsional)</label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Tambahkan catatan untuk warga..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleUpdateStatus}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
