import { useContext } from 'react';
import { CartContext } from '../context/cart';
import { Iservicio } from '../interface';

export const useCart = () => {

    const { date, hour, total, cart, shippingAddress, selectedDate, addProductToCart, updateInfo, updateAddress, createOrder, clearCard } = useContext(CartContext);

    const addDetail = (info: Iservicio) => {
        addProductToCart(info)
    }

    return {
        date,
        hour,
        total,
        cart,
        shippingAddress,
        selectedDate,
        addDetail,
        updateInfo,
        updateAddress,
        createOrder,
        clearCard
    }
}
