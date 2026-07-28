import express from 'express';
import {
   getCategories,
   createCategory,
   updateCategory,
   deleteCategory,
} from './category.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
   createCategorySchema,
   updateCategorySchema,
} from './/category.validator';

const router = express.Router();

router.use(authenticate);

router.get('/', getCategories);
router.post('/', validate(createCategorySchema), createCategory);
router.put('/:id', validate(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
