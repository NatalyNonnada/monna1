import { IReserva, IVenta } from '../../interface';
import { SaleState } from './SaleProvider';

type SaleActionType =
    | { type: '[Sale] - Set venta', payload: IVenta }
    | { type: '[Sale] - Set ventas', payload: IVenta[] }
    | {
        type: '[Sale] - Set total', payload: {
            subTotalg: number;
            desc: number;
            total: number;
        }
    }
    | { type: '[Sale] - Set descuento', payload: number }
    | { type: '[Sale] - Clear ventas' }
    | { type: '[Cart] - Order complete' }
    | { type: '[Reserva] - Loading', payload: boolean }
    | { type: '[Reserva] - charge', payload: boolean }
    | { type: '[Reserva] - Set List', payload: IReserva[] }
    | { type: '[Reserva] - Update', payload: IReserva }
    | { type: '[Reserva] - Remove', payload: IReserva }
    | { type: '[Reserva] - View', payload: IReserva }
    | { type: 'Clear all Sale' }

export const saleReducer = (state: SaleState, action: SaleActionType): SaleState => {

    switch (action.type) {

        case '[Sale] - Set venta':
            return {
                ...state,
                venta: { ...action.payload }
            }
        case '[Sale] - Set ventas':
            return {
                ...state,
                ventas: action.payload,
                isLoaded: false
            }
        case '[Sale] - Set total':
            return {
                ...state,
                ...action.payload
            }
        case '[Sale] - Set total':
            return {
                ...state,
                total: 0,
                ventas: [],
                venta: undefined
            }
        case '[Sale] - Set descuento':
            return {
                ...state,
                desc: action.payload
            }
        case '[Sale] - Clear ventas':
            return {
                ...state,
                total: 0,
                subTotalg: 0,
                desc: 0,
                ventas: []
            }
        case '[Reserva] - Loading':
            return {
                ...state,
                lodingReserva: action.payload
            }
        case '[Reserva] - charge':
            return {
                ...state,
                chargeReserva: action.payload
            }

        case '[Reserva] - Set List':
            return {
                ...state,
                lsReservas: action.payload
            }

        case '[Reserva] - Update':

            const updatedCat = state.lsReservas.map(event => {
                if (event._id !== action.payload._id) return event;
                return action.payload;
            });

            if (!updatedCat.find(event => event._id === action.payload._id)) {
                updatedCat.push(action.payload);
            }

            return {
                ...state,
                lsReservas: updatedCat
            }
        case '[Reserva] - Remove':
            return {
                ...state,
                lsReservas: state.lsReservas.filter(event => event._id !== action.payload._id)
            }
        case '[Reserva] - View':
            return {
                ...state,
                viewReserva: { ...action.payload }
            }
        case 'Clear all Sale':
            return {
                ...state,
                ventas: [],
                venta: undefined,
                total: 0,
                subTotalg: 0,
                desc: 0,
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
                chargeReserva: false,
            }

        default:
            return state;
    }
}