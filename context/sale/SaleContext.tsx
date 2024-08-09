import { createContext } from 'react';
import { contextAction, IReserva, IVenta, lodingContext } from '../../interface';

interface load {
    id: string
    celular: string;
}

interface ContextProps {
    isLoaded: boolean;
    ventas: IVenta[];
    venta?: IVenta;
    total: number;
    subTotalg: number;
    desc: number;

    lsReservas: IReserva[];
    viewReserva: IReserva;
    lodingReserva: boolean;
    chargeReserva: boolean;

    setReserva: (supplier: IReserva | IReserva[], accion: contextAction) => void;
    setState: (estado: boolean, accion: lodingContext) => void;

    clearVenta: () => void;
    addDescuento: (descu: number) => void;
    addSaleToCart: (sale: IVenta) => void;
    addSaleLoaded: (lo: load) => void;
    addAdicionales: (adicionales: IVenta[]) => void;
    clearAllSale: () => void;
}

export const SaleContext = createContext({} as ContextProps);