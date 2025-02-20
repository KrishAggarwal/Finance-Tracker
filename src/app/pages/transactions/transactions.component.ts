import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Transaction>([]);
  
  // Pagination variables
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  totalRows = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTransactions() {
    this.transactionService.transactions$.subscribe(transactions => {
      this.dataSource.data = transactions;
      this.totalRows = transactions.length;
      
      // Reset pagination when data changes
      if (this.paginator) {
        this.paginator.firstPage();
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id);
      this.snackBar.open('Transaction deleted successfully', 'Close', {
        duration: 3000,
      });
    }
  }

  addTransaction(): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      data: { mode: 'add' },
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.addTransaction(result);
        this.snackBar.open('Transaction added successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  editTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      data: { mode: 'edit', transaction: transaction },
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.updateTransaction(result);
        this.snackBar.open('Transaction updated successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }
} 