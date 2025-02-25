export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'seller';
  status?: 'active' | 'suspended';
  emailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenCreatedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type ModalMode = 'create' | 'edit';
export type VerificationStatus = 'verified' | 'unverified';