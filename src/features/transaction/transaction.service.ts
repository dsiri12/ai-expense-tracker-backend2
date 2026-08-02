import * as repository from './transaction.repository';
import {
   TRANSACTION_ERRORS_CODES,
   TRANSACTION_ERRORS_MESSAGES,
} from './transaction.constants';

import type {
   CreateTransactionDto,
   UpdateTransactionDto,
   TransactionResponse,
   TransactionFiltersDto,
} from './transaction.types';

import { toTransactionResponse } from './transaction.mapper';
import { ConflictError } from '../../common/errors/ConflictError';
import { NotFoundError } from '../../common/errors/NotFoundError';

export const getTransactions = async (
    userId: number,
  filters: TransactionFiltersDto
): Promise<TransactionResponse[]> => {
   const entities = await repository.findTransactions(userId, filters);

   return entities.map(entity => toTransactionResponse(entity))
};

export const getTransactionById = async (
   id: number,
    userId: number,
  
): Promise<TransactionResponse> => {
   const entity = await repository.getTransactionById(id, userId);

   return toTransactionResponse(entity)
};


export const createTransaction = async (
   userId: number,
   dto: CreateTransactionDto
): Promise<TransactionResponse> => {
   try {
      const newEntity = await repository.createTransaction(userId, dto);

      return toTransactionResponse(newEntity);
   } catch (err: any) {
      if (err.code === '23505') {
         throw new ConflictError(
            TRANSACTION_ERRORS_MESSAGES.NAME_EXISTS,
            TRANSACTION_ERRORS_CODES.NAME_EXISTS
         );
      }

      throw err;
   }
};

export const updateTransaction = async (
   userId: number,
   id: number,
   dto: UpdateTransactionDto
): Promise<TransactionResponse> => {
   const updatedEntity = await repository.updateTransaction(userId, id, dto);

   if (!updatedEntity) {
      throw new NotFoundError(
         TRANSACTION_ERRORS_MESSAGES.NOT_FOUND,
         TRANSACTION_ERRORS_CODES.NOT_FOUND
      );
   }

   return toTransactionResponse(updatedEntity);
};

export const deleteTransaction = async (
   userId: number,
   id: number
): Promise<void> => {
   const deleted = await repository.deleteTransaction(userId, id);

   if (!deleted) {
      throw new NotFoundError(
         TRANSACTION_ERRORS_MESSAGES.NOT_FOUND,
         TRANSACTION_ERRORS_CODES.NOT_FOUND
      );
   }
};
