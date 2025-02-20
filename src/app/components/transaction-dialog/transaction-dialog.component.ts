import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '../../models/transaction.interface';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
})
export class TransactionDialogComponent implements OnInit {
  transactionForm: FormGroup;
  dialogTitle: string;
  categories: string[] = [
    'Salary', 'Freelance', 'Investments',
    'Rent', 'Groceries', 'Utilities',
    'Entertainment', 'Transportation',
    'Healthcare', 'Education', 'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction?: Transaction, mode: 'add' | 'edit' }
  ) {
    this.dialogTitle = data.mode === 'add' ? 'Add Transaction' : 'Edit Transaction';
    
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), [Validators.required]],
      type: ['expense', [Validators.required]],
      category: ['', [Validators.required]]
    });

    if (data.mode === 'edit' && data.transaction) {
      this.transactionForm.patchValue({
        ...data.transaction,
        date: new Date(data.transaction.date)
      });
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transaction: Transaction = {
        id: this.data.transaction?.id || Date.now().toString(),
        ...formValue
      };
      this.dialogRef.close(transaction);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 