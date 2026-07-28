import type { Request, Response } from 'express';
import * as service from './category.service';
import {
   CATEGORY_ERRORS_CODES,
   CATEGORY_ERRORS_MESSAGES,
} from './category.constants';
import { ERROR_MESSAGES } from '../../common/constants/error.constants';

export const getCategories = async (req: Request, res: Response) => {
   try {
      const categories = await service.getCategories(req.userId!);

      res.json(categories);
   } catch (err: any) {
      console.error(err);

      res.status(500).json({
         message: ERROR_MESSAGES.SERVER_ERROR,
      });
   }
};

export const createCategory = async (req: Request, res: Response) => {
   try {
      const category = await service.createCategory(req.userId!, req.body);

      res.status(201).json(category);
   } catch (err) {
      if (
         err instanceof Error &&
         err.message === CATEGORY_ERRORS_CODES.NAME_EXISTS
      ) {
         return res.status(400).json({
            message: CATEGORY_ERRORS_MESSAGES.NAME_EXISTS,
         });
      }

      console.error(err);

      res.status(500).json({
         message: ERROR_MESSAGES.SERVER_ERROR,
      });
   }
};

export const updateCategory = async (req: Request, res: Response) => {
   try {
      const category = await service.updateCategory(
         req.userId!,
         Number(req.params.id),
         req.body
      );

      res.json(category);
   } catch (err) {
      if (
         err instanceof Error &&
         err.message === CATEGORY_ERRORS_CODES.NOT_FOUND
      ) {
         return res.status(404).json({
            message: CATEGORY_ERRORS_MESSAGES.NOT_FOUND,
         });
      }

      console.error(err);

      res.status(500).json({
         message: ERROR_MESSAGES.SERVER_ERROR,
      });
   }
};

export const deleteCategory = async (req: Request, res: Response) => {
   try {
      await service.deleteCategory(req.userId!, Number(req.params.id));

      res.json({
         message: 'Category deleted',
      });
   } catch (err) {
      if (
         err instanceof Error &&
         err.message === CATEGORY_ERRORS_CODES.NOT_FOUND
      ) {
         return res.status(404).json({
            message: CATEGORY_ERRORS_MESSAGES.NOT_FOUND,
         });
      }

      console.error(err);

      res.status(500).json({
         message: ERROR_MESSAGES.SERVER_ERROR,
      });
   }
};
