import { CategoryType } from "../../types/app.types";
import type {TransactionFiltersDto,CreateTransactionDto, UpdateTransactionDto} from "./transaction.validator"

export type {TransactionFiltersDto, CreateTransactionDto, UpdateTransactionDto}

export interface TransactionEntity {
  id: number;
  user_id: number;
  category_id: number | null;

  amount: string;
  type: CategoryType;
  description: string | null;
  notes: string | null;

  transaction_date: Date;

  created_at: Date;

  category_name: string;
  category_icon: string;
category_color: string;
}



export interface TransactionResponse {
  id: number;
  categoryId: number | null;
  amount: number;
  type: CategoryType;
  description: string | null;
  notes: string | null;
  transactionDate: Date;

    categoryName: string;
  categoryIcon: string;
categoryColor: string;
}

