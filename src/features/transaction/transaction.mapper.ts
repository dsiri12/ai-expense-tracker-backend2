import { TransactionEntity, TransactionResponse } from './transaction.types';

export const toTransactionResponse = (
   entity: TransactionEntity
): TransactionResponse => {
   return {
      id: entity.id,
      categoryId: entity.category_id,
      amount: Number(entity.amount),
      type: entity.type,
      description: entity.description,
      notes: entity.notes,
      transactionDate: entity.transaction_date,

      categoryName: entity.category_name,
      categoryIcon: entity.category_icon,
      categoryColor: entity.category_color,
   };
};
