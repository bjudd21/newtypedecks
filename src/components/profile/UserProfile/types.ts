/**
 * Type definitions for UserProfile component
 */

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

export interface UserProfileProps {
  user: User;
}

export interface FormData {
  name: string;
  email: string;
}

export interface FormErrors {
  [key: string]: string;
}
