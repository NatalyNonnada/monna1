import { CartState } from './';
import { IHour, IReserva, Iservicio, IShoppingAddress } from '../../interface';

type CartActionType =

   | { type: '[Cart] - LoadAddress from Cookies', payload: IShoppingAddress }
   | { type: '[Cart] - Update product in cart', payload: Iservicio }
   | { type: '[Cart] - Update Address', payload: IShoppingAddress }
   | {
      type: '[Cart] - Update order summary',
      payload: {
         date?: string;
         selectedDate?: string;
         hour?: IHour;
         total?: number;
      }
   }
   | { type: '[Cart] - Order complete' }
   | { type: '[Reserva] - Loading', payload: boolean }
   | { type: '[Reserva] - charge', payload: boolean }
   | { type: '[Reserva] - Set List', payload: IReserva[] }
   | { type: '[Reserva] - Update', payload: IReserva }
   | { type: '[Reserva] - Remove', payload: IReserva }
   | { type: '[Reserva] - View', payload: IReserva }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

   switch (action.type) {

      case '[Cart] - Update order summary':
         return {
            ...state,
            ...action.payload
         }
      case '[Cart] - Update product in cart':
         return {
            ...state,
            cart: { ...action.payload }
         }

      case '[Cart] - Update Address':
      case '[Cart] - LoadAddress from Cookies':
         return {
            ...state,
            shippingAddress: action.payload
         }

      case '[Cart] - Order complete':
         return {
            ...state,
            date: '',
            selectedDate: '',
            hour: undefined,
            total: 0,
            cart: undefined,
            shippingAddress: undefined
         }

      default:
         return state;
   }

}