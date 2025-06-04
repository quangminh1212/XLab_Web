export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
  isActive: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  admins?: number;
}
