import { MouseEvent, useState } from 'react';

export const useToggleModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const toggleModal = (): void => {
    setIsOpen(isOpen => !isOpen);
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Escape') {
      // setIsOpen(() => {
      closeModal();
      // });
    }
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.currentTarget === e.target) {
      closeModal();
      // });
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    handleKeyDown,
    handleBackdropClick,
  };
};
