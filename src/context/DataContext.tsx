import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Job, Expense, Receipt, Income } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  jobs: Job[];
  expenses: Expense[];
  receipts: Receipt[];
  income: Income[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addReceipt: (receipt: Omit<Receipt, 'id' | 'uploadDate' | 'userId'>) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  addIncome: (income: Omit<Income, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateIncome: (id: string, updates: Partial<Income>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setJobs([]);
      setExpenses([]);
      setReceipts([]);
      setIncome([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubs: (() => void)[] = [];

    const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    unsubs.push(onSnapshot(jobsQuery, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job)));
    }));

    const expensesQuery = query(collection(db, 'expenses'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    unsubs.push(onSnapshot(expensesQuery, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
    }));

    const receiptsQuery = query(collection(db, 'receipts'), where('userId', '==', user.uid), orderBy('uploadDate', 'desc'));
    unsubs.push(onSnapshot(receiptsQuery, (snapshot) => {
      setReceipts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Receipt)));
    }));

    const incomeQuery = query(collection(db, 'income'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    unsubs.push(onSnapshot(incomeQuery, (snapshot) => {
      setIncome(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Income)));
      setLoading(false);
    }));

    return () => unsubs.forEach(unsub => unsub());
  }, [user]);

  const addJob = async (job: Omit<Job, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'jobs'), {
      ...job,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    await updateDoc(doc(db, 'jobs', id), updates);
  };

  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, 'jobs', id));
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    await updateDoc(doc(db, 'expenses', id), updates);
  };

  const deleteExpense = async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id));
  };

  const addReceipt = async (receipt: Omit<Receipt, 'id' | 'uploadDate' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'receipts'), {
      ...receipt,
      userId: user.uid,
      uploadDate: new Date().toISOString()
    });
  };

  const deleteReceipt = async (id: string) => {
    await deleteDoc(doc(db, 'receipts', id));
  };

  const addIncome = async (inc: Omit<Income, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'income'), {
      ...inc,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const updateIncome = async (id: string, updates: Partial<Income>) => {
    await updateDoc(doc(db, 'income', id), updates);
  };

  const deleteIncome = async (id: string) => {
    await deleteDoc(doc(db, 'income', id));
  };

  return (
    <DataContext.Provider value={{
      jobs, expenses, receipts, income,
      addJob, updateJob, deleteJob,
      addExpense, updateExpense, deleteExpense,
      addReceipt, deleteReceipt,
      addIncome, updateIncome, deleteIncome,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
