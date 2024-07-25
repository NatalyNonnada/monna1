import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { IHour, IOrder, Iservicio, IShoppingAddress } from '../../interface';
import { CartContext, cartReducer } from './';
import { tesloApi } from '../../api';


interface summary {
    date?: string;
    hour?: IHour;
    total?: number;
    selectedDate?: string;
    calenDate?: string;
}


export interface CartState {
    isLoaded: boolean;
    cart?: Iservicio;
    date: string;
    selectedDate: string;
    calenDate: string;
    hour?: IHour;
    total: number;
    shippingAddress?: IShoppingAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    date: '',
    total: 0,
    hour: undefined,
    selectedDate: '',
    calenDate: ''
}

interface Props {
    children: any
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {

        if (Cookie.get('firstName')) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                email: Cookie.get('email') || '',
                phone: Cookie.get('phone') || '',
            }

            dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress })
        }
    }, []);

    useEffect(() => {

        const oderSummary = {
            date: '',
            selectedDate: '',
            hour: undefined,
            total: state.cart?.price
        }

        dispatch({ type: '[Cart] - Update order summary', payload: oderSummary });

    }, [state.cart]);

    const addProductToCart = (servicio: Iservicio) => {
        dispatch({ type: '[Cart] - Update product in cart', payload: servicio });
    }

    const updateAddress = (address: IShoppingAddress) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('email', address.email);
        Cookie.set('phone', address.phone);

        dispatch({ type: '[Cart] - Update Address', payload: address });
    }

    const updateInfo = (info: summary) => {
        dispatch({ type: '[Cart] - Update order summary', payload: info });
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {

        try {

            if (!state.shippingAddress) {
                throw new Error('No hay datos de usuario');
            }

            const body: IOrder = {
                shippingAddress: state.shippingAddress,
                date: state.date,
                selectedDate: state.selectedDate,
                hour: state.hour,
                total: state.total,
                Servicio: state.cart?._id || ''
            }

            const { data } = await tesloApi.post<string>('/orders', body);

            clearCard();

            Cookie.remove('firstName');
            Cookie.remove('lastName');
            Cookie.remove('email');
            Cookie.remove('phone');

            return {
                hasError: false,
                message: data || ''
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }

    const clearCard = () => {
        dispatch({ type: '[Cart] - Order complete' });
    }

    return (
        <CartContext.Provider value={{
            ...state,
            // Methods
            updateAddress,
            addProductToCart,
            updateInfo,
            // Orders
            createOrder,
            clearCard
        }}>
            {children}
        </CartContext.Provider>
    )
};