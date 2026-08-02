import { db } from '../../config/db';
import type {
   CreateTransactionDto,
   UpdateTransactionDto,
   TransactionEntity,
   TransactionFiltersDto,
} from './transaction.types';

export const findTransactions = async (
   userId: number,
   filters: TransactionFiltersDto
): Promise<TransactionEntity[]> => {
   const { startDate, endDate, categoryId, type, search, limit, offset } =
      filters;

   const conditions = ['t.user_id = $1'];
   const values: unknown[] = [userId];

   let idx = 2;

   if (startDate) {
      conditions.push(`t.transaction_date >= $${idx}`);
      values.push(startDate);
      idx++;
   }

   if (endDate) {
      conditions.push(`t.transaction_date <= $${idx}`);
      values.push(endDate);
      idx++;
   }

   if (categoryId) {
      conditions.push(`t.category_id = $${idx}`);
      values.push(categoryId);
      idx++;
   }

   if (type) {
      conditions.push(`t.type = $${idx}`);
      values.push(type);
      idx++;
   }

   if (search) {
      conditions.push(`(t.description ILIKE $${idx} OR t.notes ILIKE $${idx})`);
      values.push(`%${search}`);
      idx++;
   }

   values.push(limit, offset);

   const selectString = `
      SELECT t.*,
             c.name AS category_name,
             c.icon AS category_icon,
             c.color AS category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY t.transaction_date DESC, t.id DESC
      LIMIT $${idx++} OFFSET $${idx}
    `;
   console.log('>>>>>> selectString=', selectString, ', values=', values);

   const result = await db.query<TransactionEntity>(selectString, values);

   return result.rows;
};

export const getTransactionById = async (id: number, userId: number) => {
   const result = await db.query<TransactionEntity>(
      `
      SELECT t.*,
              c.name AS category_name,
              c.icon AS category_icon,
              c.color AS category_color
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = $1 AND t.user_id = $2
       `,
      [id, userId]
   );

   return result.rows[0] ?? null;
};

export const createTransaction = async (
   userId: number,
   createTransactionDto: CreateTransactionDto
): Promise<TransactionEntity> => {
   const { categoryId, amount, type, description, notes, transactionDate } =
      createTransactionDto;

   const result = await db.query<TransactionEntity>(
      `
      INSERT INTO transactions (user_id, category_id, amount, type, description, notes, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *
      `,
      [
         userId,
         categoryId || null,
         amount,
         type,
         description || null,
         notes || null,
         transactionDate,
      ]
   );

   return result.rows[0];
};

export const updateTransaction = async (
   userId: number,
   id: number,
   updateTransactionDto: UpdateTransactionDto
): Promise<TransactionEntity | null> => {
   const { categoryId, amount, type, description, notes, transactionDate } = updateTransactionDto;

    const result = await db.query<TransactionEntity>(
        `UPDATE transactions
         SET category_id = COALESCE($1, category_id),
             amount = COALESCE($2, amount),
             type = COALESCE($3, type),
             description = COALESCE($4, description),
             notes = COALESCE($5, notes),
             transaction_date = COALESCE($6, transaction_date)
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [categoryId, amount, type, description, notes, transactionDate, id, userId]
    );

   return result.rows[0] ?? null;
};

/**
 * Delete a transaction by transaction id and current user id.
 * 
 * @param userId user id
 * @param id transaction id
 * @returns true if delete ok
 */
export const deleteTransaction = async (
   userId: number,
   id: number
): Promise<boolean> => {
   const result = await db.query(
      `
      DELETE FROM transactions
       WHERE id = $1 AND user_id = $2
       RETURNING id
      `,
      [id, userId]
   );

   return result.rowCount === 1;
};
