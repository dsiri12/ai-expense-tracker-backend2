import { CategoryType } from "../../types/app.types";
import type {CreateCategoryDto, UpdateCategoryDto} from "./category.validator"

export type {CreateCategoryDto, UpdateCategoryDto}

export interface CategoryEntity {
  id: number;
  user_id: number;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  is_default: boolean;
  created_at: Date;
}

export interface CategoryResponse {
  id: number;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  is_default: boolean;
  // created_at: Date;
}

