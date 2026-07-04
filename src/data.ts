import { Expense, Income, Job, Receipt } from './types';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    userId: 'user-1',
    customerName: 'Sarah Jenkins',
    address: '123 Oak Lane, Springfield',
    status: 'Open',
    notes: 'Kitchen extension and refit. Customer requested additional sockets on the west wall.',
    createdAt: '2023-10-25T10:00:00Z',
  },
  {
    id: 'job-2',
    userId: 'user-1',
    customerName: 'Mark Thompson',
    address: '45 Pine St, Springfield',
    status: 'Open',
    createdAt: '2023-10-28T14:30:00Z',
  },
  {
    id: 'job-3',
    userId: 'user-1',
    customerName: 'Emma Davis',
    status: 'Quoted',
    createdAt: '2023-11-02T09:15:00Z',
  }
];

export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    userId: 'user-1',
    date: '2023-11-04T10:00:00Z',
    amount: 145.50,
    vat: 29.10,
    supplier: 'Builders Warehouse',
    category: 'Materials',
    paymentMethod: 'Card',
    jobId: 'job-1',
    receiptId: 'rec-1',
    createdAt: '2023-11-04T10:05:00Z',
  },
  {
    id: 'exp-1a',
    userId: 'user-1',
    date: '2023-11-05T09:30:00Z',
    amount: 350.00,
    vat: 70.00,
    supplier: 'Tom the Electrician',
    category: 'Subcontractors',
    paymentMethod: 'Bank Transfer',
    jobId: 'job-1',
    createdAt: '2023-11-05T09:35:00Z',
  },
  {
    id: 'exp-2',
    userId: 'user-1',
    date: '2023-11-03T15:30:00Z',
    amount: 45.00,
    vat: 9.00,
    supplier: 'Texaco Station',
    category: 'Fuel',
    paymentMethod: 'Card',
    createdAt: '2023-11-03T15:35:00Z',
  },
  {
    id: 'exp-3',
    userId: 'user-1',
    date: '2023-11-01T08:00:00Z',
    amount: 320.00,
    vat: 64.00,
    supplier: 'Tool Station',
    category: 'Tools',
    paymentMethod: 'Card',
    createdAt: '2023-11-01T08:10:00Z',
  }
];

export const mockReceipts: Receipt[] = [
  {
    id: 'rec-1',
    userId: 'user-1',
    originalImageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&q=80',
    uploadDate: '2023-11-04T10:05:00Z',
    ocrText: "BUILDERS WAREHOUSE\n123 High Street\n\nDate: 04/11/2023\nTime: 10:00\n\nCement 25kg x4 ........ £35.00\nTimber 2x4 x10 ........ £85.50\nScrews 100pk .......... £25.00\n\nSubtotal: £145.50\nVAT @ 20%: £29.10\n\nTOTAL: £145.50\n\nTHANK YOU FOR SHOPPING WITH US"
  },
  {
    id: 'rec-2',
    userId: 'user-1',
    originalImageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=100&q=80',
    uploadDate: '2023-11-03T15:35:00Z',
    ocrText: "TEXACO STATION\nSouthway Road\n\nDate: 03/11/2023\nPump 4\nUnleaded: 30.12 Litres\n\nTOTAL: £45.00\nVAT: £9.00\n\nPLEASE DRIVE SAFELY"
  }
];

export const mockIncome: Income[] = [
  {
    id: 'inc-1',
    userId: 'user-1',
    invoiceNumber: 'INV-2023-041',
    customerName: 'Sarah Jenkins',
    date: '2023-10-30T09:00:00Z',
    amount: 1500.00,
    vat: 300.00,
    paymentMethod: 'Bank Transfer',
    jobId: 'job-1',
    createdAt: '2023-10-30T09:00:00Z',
  },
  {
    id: 'inc-1a',
    userId: 'user-1',
    invoiceNumber: 'INV-2023-043',
    customerName: 'Sarah Jenkins',
    date: '2023-11-10T10:00:00Z',
    amount: 2000.00,
    vat: 400.00,
    paymentMethod: 'Bank Transfer',
    jobId: 'job-1',
    createdAt: '2023-11-10T10:00:00Z',
  },
  {
    id: 'inc-2',
    userId: 'user-1',
    invoiceNumber: 'INV-2023-042',
    customerName: 'Robert Smith',
    date: '2023-11-02T11:00:00Z',
    amount: 450.00,
    vat: 90.00,
    paymentMethod: 'Cash',
    createdAt: '2023-11-02T11:00:00Z',
  }
];

// Summary Data for Dashboard
export const summaryData = {
  todaySpending: 145.50,
  weekSpending: 510.50,
  monthSpending: 1250.00,
  outstandingInvoices: 3400.00,
};

export const cashFlowData = [
  { month: 'Jun', income: 4200, expense: 2100 },
  { month: 'Jul', income: 5100, expense: 2400 },
  { month: 'Aug', income: 3800, expense: 1900 },
  { month: 'Sep', income: 6200, expense: 3100 },
  { month: 'Oct', income: 5800, expense: 2800 },
  { month: 'Nov', income: 1950, expense: 510 },
];

export const expenseCategoryData = [
  { name: 'Materials', value: 4500 },
  { name: 'Fuel', value: 800 },
  { name: 'Tools', value: 1200 },
  { name: 'Subcontractors', value: 2100 },
];
