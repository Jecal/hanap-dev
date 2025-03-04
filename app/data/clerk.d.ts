import { Role } from "./types"

export {}

declare global {
  interface CustomJwtSessionClaims {
    role: Role
  }
}