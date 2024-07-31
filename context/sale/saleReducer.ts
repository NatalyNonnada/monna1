import { IVenta } from '../../interface';
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
        default:
            return state;
    }
}