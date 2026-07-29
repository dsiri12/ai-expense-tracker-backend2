import type { Request, Response } from 'express';
import * as service from './category.service';

export const getCategories = async (req: Request, res: Response) => {
   const categories = await service.getCategories(req.userId!);

   res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
   const category = await service.createCategory(req.userId!, req.body);

   res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
   const category = await service.updateCategory(
      req.userId!,
      Number(req.params.id),
      req.body
   );

   res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
   await service.deleteCategory(req.userId!, Number(req.params.id));

   res.json({
      message: 'Category deleted',
   });
};
