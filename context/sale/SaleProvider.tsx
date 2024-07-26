import { FC, useEffect, useReducer } from 'react';
import { IVenta } from '../../interface';
import { saleReducer } from './saleReducer';
import { SaleContext } from './SaleContext';
import Cookie from 'js-cookie';
import { initFecha } from '../../utils';

export interface SaleState {
    total: number;
    isLoaded: boolean;
    ventas: IVenta[];
    venta?: IVenta;
}

const SALE_INITIAL_STATE: SaleState = {
    isLoaded: true,
    ventas: [],
    total: 0,
}

interface Props {
    children: any
}

interface load {
    id: string
    celular: string;
}

export const SaleProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(saleReducer, SALE_INITIAL_STATE);

    useEffect(() => {
        const total = state.ventas.reduce((prev, current) => current.total + prev, 0);
        dispatch({ type: '[Sale] - Set total', payload: total });
    }, [state.ventas]);


    const clearVenta = () => {
        const jsonArray = JSON.stringify([]);
        Cookie.set('carrito-ventas', jsonArray, {
            expires: 1,
            sameSite: 'strict'
        });

        dispatch({ type: '[Sale] - Clear ventas' });
    }

    const addSaleToCart = (sale: IVenta) => {

        const existser = state.ventas.some(event => event?._id === sale._id);

        if (!existser) {
            const newList: IVenta[] = [...state.ventas, { ...sale }];
            const jsonArray = JSON.stringify(newList);
            Cookie.set('carrito-ventas', jsonArray, {
                expires: 1,
                sameSite: 'strict'
            });

            dispatch({ type: '[Sale] - Set ventas', payload: newList })
        }
    }

    const addSaleLoaded = (lo: load) => {

        const jsonArray = Cookie.get('carrito-ventas');

        const arrayDeObjetos = jsonArray ? JSON.parse(jsonArray) : [];

        const lisVen = arrayDeObjetos as IVenta[];

        const existser = lisVen.some(event => event?._id === lo.id);

        if (!existser) {
            const fillVen = lisVen.filter(p => p?.celular === lo.celular && p?.fecha === initFecha.mindataFor());
            dispatch({ type: '[Sale] - Set ventas', payload: fillVen })
        } else {
            dispatch({ type: '[Sale] - Set ventas', payload: lisVen })
        }
    }

    const ChangeLoaded = (change: boolean) => {

    }

    return (
        <SaleContext.Provider value={{
            ...state,
            // Methods
            clearVenta,
            addSaleToCart,
            ChangeLoaded,
            addSaleLoaded,
        }}>
            {children}
        </SaleContext.Provider>
    )
}