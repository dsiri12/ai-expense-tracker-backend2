import { CategoryEntity, CategoryResponse } from "./category.types"

export const toCategoryResponse = (
  entity: CategoryEntity
): CategoryResponse => {
  const {id, name, type , icon, color, is_default} = entity

  return {id, name, type , icon, color, is_default}
}

