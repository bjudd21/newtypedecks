/**
 * Accessible modal/dialog utilities
 */

/**
 * Modal accessibility props interface
 */
export interface ModalA11yProps {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  descriptionId?: string;
  initialFocus?: React.RefObject<HTMLElement>;
}

/**
 * Get ARIA props for modal/dialog
 */
export function getModalA11yProps(props: ModalA11yProps) {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': props.titleId,
    'aria-describedby': props.descriptionId,
  };
}
