import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  summary = { income: 0, expenses: 0, balance: 0 };
  recentTransactions: any[] = [];
  transactions: any[] = [];
  
  @ViewChild('expensesChart') expensesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('incomeChart') incomeChart!: ElementRef<HTMLCanvasElement>;
  private expensesPieChart: Chart | undefined;
  private incomePieChart: Chart | undefined;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
      this.summary = this.transactionService.getSummary();
      this.recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });
  }

  ngAfterViewInit() {
    // Initialize charts after view is ready
    this.updateCharts(this.transactions);
  }

  ngOnDestroy() {
    if (this.expensesPieChart) {
      this.expensesPieChart.destroy();
    }
    if (this.incomePieChart) {
      this.incomePieChart.destroy();
    }
  }

  private updateCharts(transactions: any[]) {
    this.updateExpensesChart(transactions);
    this.updateIncomeChart(transactions);
  }

  private updateExpensesChart(transactions: any[]) {
    const categoryTotals = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        const category = transaction.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += transaction.amount;
      }
      return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data:number[] = Object.values(categoryTotals);
    const colors = labels.map(() => this.generateRandomColor());

    if (this.expensesPieChart) {
      this.expensesPieChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Expenses by Category'
          }
        }
      }
    };

    if (this.expensesChart && this.expensesChart.nativeElement) {
      this.expensesPieChart = new Chart(this.expensesChart.nativeElement, config);
    }
  }

  private updateIncomeChart(transactions: any[]) {
    const categoryTotals = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        const category = transaction.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += transaction.amount;
      }
      return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data:number[] = Object.values(categoryTotals);
    const colors = labels.map(() => this.generateRandomColor());

    if (this.incomePieChart) {
      this.incomePieChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Income by Category'
          }
        }
      }
    };

    if (this.incomeChart && this.incomeChart.nativeElement) {
      this.incomePieChart = new Chart(this.incomeChart.nativeElement, config);
    }
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
} 