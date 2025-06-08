
export type Role = "resident" | "operator" | "maintenance" | "prospect" | "vendor";

export interface UserRole {
  role: Role;
  userId?: string;
  name?: string;
  email?: string;
}
