export {}

// Create a type for the roles
export type Roles = 'hospital_admin' | 'Member'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}