import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { complaintAPI } from "@/lib/api";
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  LogIn,
} from "lucide-react";

const categoryLabels = {
  jalan_rusak: "Jalan Rusak",
  sampah: "Sampah Menumpuk",
  penerangan: "Penerangan Jalan Mati",
  saluran_air: "Saluran Air Tersumbat",
  fasilitas_umum: "Fasilitas Umum Rusak",
  lainnya: "Lainnya",
};

export default function Lapor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran foto maksimal 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.phone.trim()) newErrors.phone = "No. HP wajib diisi";
    if (!formData.address.trim()) newErrors.address = "Alamat wajib diisi";
    if (!formData.category) newErrors.category = "Kategori wajib dipilih";
    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Deskripsi minimal 20 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk membuat laporan",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData for API
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("email", formData.email);
      apiFormData.append("phone", formData.phone);
      apiFormData.append("address", formData.address);
      apiFormData.append("category", formData.category);
      apiFormData.append("description", formData.description);

      if (imageFile) {
        apiFormData.append("image", imageFile);
      }

      // Submit to API
      const response = await complaintAPI.create(apiFormData);

      setTicketNumber(response.complaint.ticket_number);
      setSubmitted(true);

      toast({
        title: "Laporan Berhasil Dikirim",
        description: `Nomor tiket Anda: ${response.complaint.ticket_number}`,
      });
    } catch (error: any) {
      toast({
        title: "Gagal Mengirim Laporan",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                Anda harus login terlebih dahulu untuk membuat laporan
                pengaduan.
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

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-lg mx-auto border-2 border-accent">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Laporan Berhasil Dikirim!
              </h2>
              <p className="text-muted-foreground mb-6">
                Terima kasih telah menyampaikan pengaduan Anda. Laporan akan
                segera ditindaklanjuti.
              </p>

              <div className="bg-secondary p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Nomor Tiket Anda
                </p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {ticketNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Simpan nomor tiket ini untuk melacak status laporan
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate("/tracking")}
                  className="flex-1"
                >
                  Lacak Status
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                      phone: user?.phone || "",
                      address: "",
                      category: "",
                      description: "",
                    });
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="flex-1"
                >
                  Buat Laporan Baru
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Buat Laporan
            </h1>
            <p className="text-muted-foreground">
              Sampaikan pengaduan Anda dengan mengisi formulir di bawah ini
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Formulir Pengaduan</CardTitle>
              <CardDescription>
                Mohon isi data dengan lengkap dan benar agar laporan dapat
                diproses dengan baik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Data Pelapor
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Masukkan nama lengkap"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="contoh@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor HP *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="08xxxxxxxxxx"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lokasi Masalah *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
                      rows={2}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Detail Pengaduan
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori Masalah *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger
                        className={errors.category ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Pilih kategori masalah" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Masalah *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Jelaskan permasalahan yang Anda laporkan secara detail..."
                      rows={4}
                      className={errors.description ? "border-destructive" : ""}
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/500 karakter
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Foto Pendukung (opsional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                          >
                            Hapus Foto
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="image" className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Klik untuk upload foto
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Format: JPG, PNG (Maks. 5MB)
                          </p>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Mengirim Laporan...
                    </>
                  ) : (
                    "Kirim Laporan"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
