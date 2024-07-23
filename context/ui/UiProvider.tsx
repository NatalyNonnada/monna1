import { FC, useReducer } from 'react';
import { uiReducer } from './uiReducer';
import { UiContext } from './UiContext';

export interface UiState {
    isSideMenu: boolean;
}

const UI_INITIAL_STATE: UiState = {
    isSideMenu: false,
}

interface Props {
    children: any
}

export const UiProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    const sideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
    }

    return (
        <UiContext.Provider value={{
            ...state,
            sideMenu
        }}>
            {children}
        </UiContext.Provider>
    )
};
