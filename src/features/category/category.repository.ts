import { db } from '../../config/db';
import type {
   CreateCategoryDto,
   UpdateCategoryDto,
   CategoryEntity,
} from './category.types';

export const findCategories = async (
   userId: number
): Promise<CategoryEntity[]> => {
   const result = await db.query<CategoryEntity>(
      `SELECT *
     FROM categories
     WHERE user_id = $1
     ORDER BY type, name`,
      [userId]
   );
   // The generic type parameter for pg's query<T>() represents the type of a single row, not the entire rows array.

   // result.rows is CategoryEntity[]
   return result.rows;
};

export const createCategory = async (
   userId: number,
   category: CreateCategoryDto
): Promise<CategoryEntity> => {
   const { name, type, icon, color } = category;

   const result = await db.query<CategoryEntity>(
      `INSERT INTO categories
      (user_id, name, type, icon, color, is_default)
     VALUES
      ($1,$2,$3,$4,$5,false)
     RETURNING *`,
      [userId, name, type, icon, color]
   );

   return result.rows[0];
};

export const updateCategory = async (
   userId: number,
   id: number,
   category: UpdateCategoryDto
): Promise<CategoryEntity | null> => {
   const { name, icon, color } = category;

   const result = await db.query<CategoryEntity>(
      `UPDATE categories
        SET name = COALESCE($1,name),
            icon = COALESCE($2,icon),
            color = COALESCE($3,color)
      WHERE id = $4
        AND user_id = $5
      RETURNING *`,
      [name, icon, color, id, userId]
   );

   return result.rows[0] ?? null;
};

export const deleteCategory = async (
   userId: number,
   id: number
): Promise<boolean> => {
   const result = await db.query(
      `DELETE FROM categories
      WHERE id = $1
        AND user_id = $2
      RETURNING id`,
      [id, userId]
   );

   return result.rowCount === 1;
};
