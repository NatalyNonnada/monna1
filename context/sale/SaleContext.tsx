import { createContext } from 'react';
import { IVenta } from '../../interface';

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

    clearVenta: () => void;
    addDescuento: (descu: number) => void;
    addSaleToCart: (sale: IVenta) => void;
    addSaleLoaded: (lo: load) => void;
    addAdicionales: (adicionales: IVenta[]) => void;
}

export const SaleContext = createContext({} as ContextProps);