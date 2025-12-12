import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  AlertTriangle,
  Trash2,
  Lightbulb,
  Droplets,
  Building
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Lapor Mudah',
    description: 'Sampaikan pengaduan Anda dengan mengisi formulir sederhana beserta foto pendukung.',
  },
  {
    icon: Search,
    title: 'Lacak Status',
    description: 'Pantau perkembangan laporan Anda secara real-time menggunakan nomor tiket.',
  },
  {
    icon: Clock,
    title: 'Respon Cepat',
    description: 'Pengaduan Anda akan segera ditindaklanjuti oleh petugas terkait.',
  },
  {
    icon: CheckCircle,
    title: 'Transparan',
    description: 'Informasi status pengaduan yang jelas dan dapat dipantau kapan saja.',
  },
];

const categories = [
  { icon: AlertTriangle, label: 'Jalan Rusak', color: 'bg-destructive/10 text-destructive' },
  { icon: Trash2, label: 'Sampah Menumpuk', color: 'bg-warning/10 text-warning' },
  { icon: Lightbulb, label: 'Penerangan Mati', color: 'bg-info/10 text-info' },
  { icon: Droplets, label: 'Saluran Tersumbat', color: 'bg-primary/10 text-primary' },
  { icon: Building, label: 'Fasilitas Umum', color: 'bg-accent/10 text-accent' },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          </div>
          
          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Suarakan Keluhan Anda,
                <br />
                <span className="opacity-90">Kami Tindaklanjuti</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl">
                Platform pengaduan masyarakat untuk melaporkan permasalahan lingkungan 
                seperti jalan rusak, sampah menumpuk, penerangan mati, dan lainnya secara 
                mudah dan transparan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-base font-semibold">
                  <Link to="/lapor">
                    <FileText className="mr-2 h-5 w-5" />
                    Buat Laporan
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/tracking">
                    <Search className="mr-2 h-5 w-5" />
                    Lacak Status
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${cat.color} font-medium text-sm`}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Mengapa Lapor Warga?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sistem pengaduan yang dirancang untuk memudahkan masyarakat dalam 
                menyampaikan keluhan dan memantau penanganannya.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Cara Melaporkan
              </h2>
              <p className="text-lg text-muted-foreground">
                Tiga langkah mudah untuk menyampaikan pengaduan Anda
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: '1', title: 'Isi Formulir', desc: 'Lengkapi data diri dan detail pengaduan Anda' },
                { step: '2', title: 'Dapatkan Tiket', desc: 'Simpan nomor tiket sebagai bukti pelaporan' },
                { step: '3', title: 'Pantau Status', desc: 'Lacak perkembangan laporan secara real-time' },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                  {index < 2 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 h-8 w-8 text-primary" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/lapor">
                  Mulai Laporan Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
