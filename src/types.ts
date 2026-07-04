export type JobStatus = 'Open' | 'Closed' | 'Quoted' | 'Paid';
export type PaymentMethod = 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque';

export interface User {
  id: string; // UUID from Supabase Auth
  name: string;
  email: string;
  phone?: string;
  taxNumber?: string;
  businessName?: string;
  createdAt: string;
}

export interface Job {
  id: string; // UUID
  userId: string; // FK to User
  customerName: string;
  address?: string;
  phone?: string;
  email?: string;
  status: JobStatus;
  notes?: string;
  createdAt: string;
}

export interface Receipt {
  id: string; // UUID
  userId: string; // FK to User
  originalImageUrl: string; // Supabase Storage URL
  thumbnailUrl?: string; // Supabase Storage URL
  ocrText?: string;
  uploadDate: string;
}

export interface Expense {
  id: string; // UUID
  userId: string; // FK to User
  date: string;
  amount: number;
  vat: number;
  supplier: string;
  category: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptId?: string; // FK to Receipt
  jobId?: string; // FK to Job
  createdAt: string;
}

export interface Mileage {
  id: string; // UUID
  userId: string; // FK to User
  date: string;
  startLocation: string;
  endLocation: string;
  miles: number;
  jobId?: string; // FK to Job
  createdAt: string;
}

export interface Income {
  id: string; // UUID
  userId: string; // FK to User
  invoiceNumber?: string;
  customerName: string;
  date: string;
  amount: number;
  vat: number;
  paymentMethod: PaymentMethod;
  jobId?: string; // FK to Job
  createdAt: string;
}

// Supabase Database Type Placeholder
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'createdAt'>;
        Update: Partial<Omit<User, 'id' | 'createdAt'>>;
      };
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'createdAt'>;
        Update: Partial<Omit<Job, 'id' | 'createdAt'>>;
      };
      receipts: {
        Row: Receipt;
        Insert: Omit<Receipt, 'id' | 'uploadDate'>;
        Update: Partial<Omit<Receipt, 'id' | 'uploadDate'>>;
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id' | 'createdAt'>;
        Update: Partial<Omit<Expense, 'id' | 'createdAt'>>;
      };
      mileage: {
        Row: Mileage;
        Insert: Omit<Mileage, 'id' | 'createdAt'>;
        Update: Partial<Omit<Mileage, 'id' | 'createdAt'>>;
      };
      income: {
        Row: Income;
        Insert: Omit<Income, 'id' | 'createdAt'>;
        Update: Partial<Omit<Income, 'id' | 'createdAt'>>;
      };
    };
  };
}
