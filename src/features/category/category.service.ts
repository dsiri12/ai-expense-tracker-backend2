import * as repository from './category.repository';
import { CATEGORY_ERRORS_CODES } from './category.constants';
import type {
   CreateCategoryDto,
   UpdateCategoryDto,
   CategoryResponse,
} from './category.types';
import { toCategoryResponse } from './category.mapper';

export const getCategories = async (
   userId: number
): Promise<CategoryResponse[]> => {
   return repository.findCategories(userId);
};

export const createCategory = async (
   userId: number,
   dto: CreateCategoryDto
): Promise<CategoryResponse> => {
   try {
      const entity = await repository.createCategory(userId, dto);

      return toCategoryResponse(entity);
   } catch (err: any) {
      if (err.code === '23505') {
         throw new Error(CATEGORY_ERRORS_CODES.NAME_EXISTS);
      }

      throw err;
   }
};

export const updateCategory = async (
   userId: number,
   id: number,
   dto: UpdateCategoryDto
): Promise<CategoryResponse> => {
   const updatedEntity = await repository.updateCategory(userId, id, dto);

   if (!updatedEntity) {
      throw new Error(CATEGORY_ERRORS_CODES.NOT_FOUND);
   }

   return toCategoryResponse(updatedEntity);
};

export const deleteCategory = async (
   userId: number,
   id: number
): Promise<void> => {
   const deleted = await repository.deleteCategory(userId, id);

   if (!deleted) {
      throw new Error(CATEGORY_ERRORS_CODES.NOT_FOUND);
   }
};
