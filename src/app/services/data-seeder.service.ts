import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.interface';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class DataSeederService {
  private dummyTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Monthly Salary',
      amount: 5000,
      date: new Date('2025-02-01'),
      type: 'income',
      category: 'Salary'
    },
    {
      id: '2',
      description: 'Freelance Project',
      amount: 1500,
      date: new Date('2025-02-05'),
      type: 'income',
      category: 'Freelance'
    },
    {
      id: '3',
      description: 'Stock Dividends',
      amount: 300,
      date: new Date('2025-02-10'),
      type: 'income',
      category: 'Investments'
    },
    {
      id: '4',
      description: 'Apartment Rent',
      amount: 1200,
      date: new Date('2025-02-02'),
      type: 'expense',
      category: 'Rent'
    },
    {
      id: '5',
      description: 'Grocery Shopping - Walmart',
      amount: 250,
      date: new Date('2025-02-07'),
      type: 'expense',
      category: 'Groceries'
    },
    {
      id: '6',
      description: 'Electric Bill',
      amount: 120,
      date: new Date('2025-02-15'),
      type: 'expense',
      category: 'Utilities'
    },
    {
      id: '7',
      description: 'Gas Bill',
      amount: 80,
      date: new Date('2025-02-15'),
      type: 'expense',
      category: 'Utilities'
    },
    {
      id: '8',
      description: 'Movie Night',
      amount: 50,
      date: new Date('2025-02-08'),
      type: 'expense',
      category: 'Entertainment'
    },
    {
      id: '9',
      description: 'Bus Pass',
      amount: 75,
      date: new Date('2025-02-01'),
      type: 'expense',
      category: 'Transportation'
    },
    {
      id: '10',
      description: 'Part-time Consulting',
      amount: 800,
      date: new Date('2025-02-12'),
      type: 'income',
      category: 'Freelance'
    }
  ];

  constructor(private transactionService: TransactionService) {}

  seedData() {
    // Check if data already exists
    const existingData = localStorage.getItem('finance_tracker_transactions');
    if (!existingData) {
      // Store dummy data in localStorage
      localStorage.setItem('finance_tracker_transactions', JSON.stringify(this.dummyTransactions));
      
      // Update the BehaviorSubject in TransactionService
      this.transactionService['transactionsSubject'].next(this.dummyTransactions);
    }
  }
} 