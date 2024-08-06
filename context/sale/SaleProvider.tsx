import { FC, useEffect, useReducer } from 'react';
import { contextAction, IReserva, IVenta, lodingContext } from '../../interface';
import { saleReducer } from './saleReducer';
import { SaleContext } from './SaleContext';
import Cookie from 'js-cookie';
import { initFecha } from '../../utils';

export interface SaleState {
    total: number;
    desc: number;
    subTotalg: number;
    isLoaded: boolean;
    ventas: IVenta[];
    venta?: IVenta;

    lsReservas: IReserva[];
    viewReserva: IReserva;
    lodingReserva: boolean;
    chargeReserva: boolean;

}

const SALE_INITIAL_STATE: SaleState = {
    isLoaded: true,
    ventas: [],
    total: 0,
    desc: 0,
    subTotalg: 0,
    lsReservas: [],
    viewReserva: {
        servicio: '',
        category: '',
        hora: {
            hour: '',
            estate: false
        },
        fecha: '',
        fechan: '',
        total: 0,
        isConfi: false,
        nureserva: 0,
        careserva: 0,
        iniPago: '',
        isPaid: false,
        nufinal: 0,
        cafinal: 0,
        finPago: ''
    },
    lodingReserva: true,
    chargeReserva: false
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

        const subTotalg = state.ventas.reduce((prev, current) => (current.total * current.quanty) + prev, 0);

        const descuento = state.desc;

        const orderSummary = {
            subTotalg,
            desc: descuento,
            total: subTotalg - descuento
        }

        dispatch({ type: '[Sale] - Set total', payload: orderSummary });
    }, [state.ventas]);

    useEffect(() => {
        if (state.desc > 0) {
            const orderSummary = {
                subTotalg: state.subTotalg,
                desc: state.desc,
                total: state.subTotalg - state.desc
            }

            dispatch({ type: '[Sale] - Set total', payload: orderSummary });
        }
    }, [state.desc])

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

    const addDescuento = (descu: number) => {
        dispatch({ type: '[Sale] - Set descuento', payload: descu })
    };

    const addAdicionales = (adicionales: IVenta[]) => {

        let newList: IVenta[] = [...state.ventas];

        adicionales.map(adi => {
            const existser = state.ventas.find(event => event?._id === adi._id);
            if (!existser) {
                newList.push(adi)
            } else {
                newList = newList.filter(product => !(product._id === adi._id));
                newList.push({ ...existser, quanty: existser.quanty + adi.quanty })
            }
        })

        const jsonArray = JSON.stringify(newList);
        Cookie.set('carrito-ventas', jsonArray, {
            expires: 1,
            sameSite: 'strict'
        });

        dispatch({ type: '[Sale] - Set ventas', payload: newList })
    }

    const setReserva = (supplier: IReserva | IReserva[], accion: contextAction) => {
        switch (accion) {
            case 'lista':
                {
                    dispatch({ type: '[Reserva] - Set List', payload: supplier as IReserva[] });
                    return;
                }
            case 'actualizar':
                {
                    dispatch({ type: '[Reserva] - Update', payload: supplier as IReserva });
                    return;
                }
            case 'eliminar':
                {
                    dispatch({ type: '[Reserva] - Remove', payload: supplier as IReserva });
                    return;
                }
            case 'ver':
                {
                    dispatch({ type: '[Reserva] - View', payload: supplier as IReserva });
                    return;
                }
            default:
                return;
        }
    }

    const setState = (estado: boolean, accion: lodingContext) => {
        switch (accion) {
            case 'lodingReserva':
                {
                    dispatch({ type: '[Reserva] - Loading', payload: estado });
                    return;
                }
            case 'chargeReserva':
                {
                    dispatch({ type: '[Reserva] - charge', payload: estado });
                    return;
                }
            default:
                return;
        }
    }

    return (
        <SaleContext.Provider value={{
            ...state,
            // Methods
            clearVenta,
            addSaleToCart,
            addDescuento,
            addSaleLoaded,
            addAdicionales,
            setReserva,
            setState
        }}>
            {children}
        </SaleContext.Provider>
    )
}