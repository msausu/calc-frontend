import React, { FC, createContext, useContext, useReducer, ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
}

export type Action = { type: 'OPEN_REPORT' } | { type: 'CLOSE_REPORT' };

const modalReducer = (state: ModalState, action: Action): ModalState => {
  switch (action.type) {
    case 'OPEN_REPORT':
      return { isOpen: true };
    case 'CLOSE_REPORT':
      return { isOpen: false };
    default:
      return state;
  }
};

interface ModalContextProps {
  state: ModalState;
   dispatch: React.Dispatch<Action>;
};

interface ModalProviderProps {
  children: ReactNode;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, { isOpen: false });

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext;
