import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly STORAGE_KEY = 'finance_tracker_transactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const transactions = JSON.parse(stored).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
      this.transactionsSubject.next(transactions);
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const transactions = this.transactionsSubject.value;
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    this.saveTransactions([...transactions, newTransaction]);
  }

  updateTransaction(transaction: Transaction): void {
    const transactions = this.transactionsSubject.value;
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      transactions[index] = transaction;
      this.saveTransactions(transactions);
    }
  }

  deleteTransaction(id: string): void {
    const transactions = this.transactionsSubject.value;
    this.saveTransactions(transactions.filter(t => t.id !== id));
  }

  getTransaction(id: string): Transaction | undefined {
    return this.transactionsSubject.value.find(t => t.id === id);
  }

  getSummary(): { income: number; expenses: number; balance: number } {
    const transactions = this.transactionsSubject.value;
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }
}