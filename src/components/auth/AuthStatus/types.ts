/**
 * AuthStatus types
 */

export interface AuthStatusProps {
  className?: string;
}

export interface MenuItem {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}
