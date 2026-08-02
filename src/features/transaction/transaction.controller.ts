import type { Request, Response } from 'express';
import * as service from './transaction.service';
import { transactionFiltersSchema } from './transaction.validator';

export const getTransactions = async (req: Request, res: Response) => {  
    const filters = transactionFiltersSchema.parse(req.query);

    const transactions = await service.getTransactions(
      req.userId!,
      filters
    );

    res.json(transactions);
};

export const getTransactionById = async (req: Request, res: Response) => {  
   const { id } = req.params;
    
    const transaction = await service.getTransactionById(
      Number(id),
      req.userId!
    );

    res.json(transaction);
}


export const createTransaction = async (req: Request, res: Response) => {
   const transaction = await service.createTransaction(req.userId!, req.body);

   res.status(201).json(transaction);
};

export const updateTransaction = async (req: Request, res: Response) => {
   const transaction = await service.updateTransaction(
      req.userId!,
      Number(req.params.id),
      req.body
   );

   res.json(transaction);
};

export const deleteTransaction = async (req: Request, res: Response) => {
   await service.deleteTransaction(req.userId!, Number(req.params.id));

   res.json({
      message: 'Category deleted',
   });
};
