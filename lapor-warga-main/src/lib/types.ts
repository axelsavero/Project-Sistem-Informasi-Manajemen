export type ComplaintStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export type ComplaintCategory = 
  | 'jalan_rusak'
  | 'sampah'
  | 'penerangan'
  | 'saluran_air'
  | 'fasilitas_umum'
  | 'lainnya';

export interface Complaint {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: ComplaintCategory;
  description: string;
  imageUrl?: string;
  status: ComplaintStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const categoryLabels: Record<ComplaintCategory, string> = {
  jalan_rusak: 'Jalan Rusak',
  sampah: 'Sampah Menumpuk',
  penerangan: 'Penerangan Jalan Mati',
  saluran_air: 'Saluran Air Tersumbat',
  fasilitas_umum: 'Fasilitas Umum Rusak',
  lainnya: 'Lainnya',
};

export const statusLabels: Record<ComplaintStatus, string> = {
  pending: 'Menunggu',
  in_progress: 'Diproses',
  completed: 'Selesai',
  rejected: 'Ditolak',
};

export const statusColors: Record<ComplaintStatus, string> = {
  pending: 'bg-warning/10 text-warning border-warning/30',
  in_progress: 'bg-info/10 text-info border-info/30',
  completed: 'bg-accent/10 text-accent border-accent/30',
  rejected: 'bg-destructive/10 text-destructive border-destructive/30',
};
