import type { UserEntity, UserResponse } from "./auth.types";

export const toUserResponse = (
  user: UserEntity
): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  currency: user.currency,
})

