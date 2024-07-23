import { createContext } from 'react';
import { Iservicio, ISummary, IShoppingAddress, IHour } from '../../interface';

interface ContextProps {
    isLoaded: boolean;
    date: string;
    selectedDate: string;
    hour?: IHour;
    total: number;
    cart?: Iservicio;
    shippingAddress?: IShoppingAddress;
    // Methods
    addProductToCart: (servicio: Iservicio) => void;
    updateAddress: (address: IShoppingAddress) => void;
    updateInfo: (info: ISummary) => void;
    // Orders
    createOrder: () => Promise<{ hasError: boolean; message: string; }>;
    clearCard: () => void;
}

export const CartContext = createContext({} as ContextProps);