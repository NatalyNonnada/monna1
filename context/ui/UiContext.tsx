import { createContext } from 'react';

interface ContextProps {
    isSideMenu: boolean;
    sideMenu: () => void
}

export const UiContext = createContext({} as ContextProps);