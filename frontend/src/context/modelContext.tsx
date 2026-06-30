import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ModalContextType = {
  authMessage: string | null;
  setAuthMessage: (
    message: string | null
  ) => void;
};

const ModalContext =
  createContext<
    ModalContextType | undefined
  >(undefined);

export function ModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    authMessage,
    setAuthMessage,
  ] = useState<string | null>(null);

  return (
    <ModalContext.Provider
      value={{
        authMessage,
        setAuthMessage,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context =
    useContext(ModalContext);

  if (!context) {
    throw new Error(
      "useModal debe usarse dentro de ModalProvider"
    );
  }

  return context;
}