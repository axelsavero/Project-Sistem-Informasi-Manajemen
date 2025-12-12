import { Complaint, ComplaintCategory, ComplaintStatus } from './types';

// Generate ticket number
export function generateTicketNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LP${year}${month}${day}-${random}`;
}

// Local storage key
const STORAGE_KEY = 'lapor_warga_complaints';

// Get all complaints
export function getComplaints(): Complaint[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const complaints = JSON.parse(stored);
  return complaints.map((c: Complaint) => ({
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  }));
}

// Save complaint
export function saveComplaint(complaint: Omit<Complaint, 'id' | 'ticketNumber' | 'status' | 'createdAt' | 'updatedAt'>): Complaint {
  const complaints = getComplaints();
  const newComplaint: Complaint = {
    ...complaint,
    id: crypto.randomUUID(),
    ticketNumber: generateTicketNumber(),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  complaints.push(newComplaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return newComplaint;
}

// Update complaint
export function updateComplaint(id: string, updates: Partial<Complaint>): Complaint | null {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  complaints[index] = {
    ...complaints[index],
    ...updates,
    updatedAt: new Date(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return complaints[index];
}

// Find complaint by ticket number
export function findByTicketNumber(ticketNumber: string): Complaint | null {
  const complaints = getComplaints();
  return complaints.find(c => c.ticketNumber.toLowerCase() === ticketNumber.toLowerCase()) || null;
}

// Get complaints by status
export function getComplaintsByStatus(status: ComplaintStatus): Complaint[] {
  return getComplaints().filter(c => c.status === status);
}

// Get complaint stats
export function getComplaintStats() {
  const complaints = getComplaints();
  return {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    completed: complaints.filter(c => c.status === 'completed').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  };
}
