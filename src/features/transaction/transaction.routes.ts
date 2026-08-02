import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  // analyzeTransactions,
} from './transaction.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createTransactionSchema, updateTransactionSchema } from './transaction.validator';

const router = express.Router();

router.use(authenticate);

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', validate(createTransactionSchema), createTransaction);
router.put('/:id', validate(updateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

// router.post('/analyze', analyzeTransactions);

export default router;
