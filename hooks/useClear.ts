import { useContext } from 'react';
import { NonnaContext, SaleContext } from '../context';

export const useClear = () => {

    const { clearAllSale } = useContext(SaleContext);
    const { clearAllNona } = useContext(NonnaContext);

    return {
        clearAllNona,
        clearAllSale
    }
}
