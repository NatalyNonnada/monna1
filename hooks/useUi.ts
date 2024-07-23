import { useContext } from 'react'
import { UiContext } from '../context';

export const useUi = () => {

    const { isSideMenu, sideMenu } = useContext(UiContext);

    return {
        isSideMenu,
        sideMenu
    }
}
