import * as repository from './category.repository';
import {
   CATEGORY_ERRORS_CODES,
   CATEGORY_ERRORS_MESSAGES,
} from './category.constants';
import type {
   CreateCategoryDto,
   UpdateCategoryDto,
   CategoryResponse,
} from './category.types';
import { toCategoryResponse } from './category.mapper';
import { ConflictError } from '../../common/errors/ConflictError';
import { NotFoundError } from '../../common/errors/NotFoundError';

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
      const newEntity = await repository.createCategory(userId, dto);

      return toCategoryResponse(newEntity);
   } catch (err: any) {
      if (err.code === '23505') {
         throw new ConflictError(
            CATEGORY_ERRORS_MESSAGES.NAME_EXISTS,
            CATEGORY_ERRORS_CODES.NAME_EXISTS
         );
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
      throw new NotFoundError(
         CATEGORY_ERRORS_MESSAGES.NOT_FOUND,
         CATEGORY_ERRORS_CODES.NOT_FOUND
      );
   }

   return toCategoryResponse(updatedEntity);
};

export const deleteCategory = async (
   userId: number,
   id: number
): Promise<void> => {
   const deleted = await repository.deleteCategory(userId, id);

   if (!deleted) {
      throw new NotFoundError(
         CATEGORY_ERRORS_MESSAGES.NOT_FOUND,
         CATEGORY_ERRORS_CODES.NOT_FOUND
      );
   }
};
