import { IVenta } from '../../interface';
import { SaleState } from './SaleProvider';

type SaleActionType =

    // | { type: '[Sale] - Load sale from Cookies', payload: IVenta[] }
    | { type: '[Sale] - Set venta', payload: IVenta }
    | { type: '[Sale] - Set ventas', payload: IVenta[] }
    | { type: '[Sale] - Set total', payload: number }
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
                total: action.payload
            }
        case '[Sale] - Set total':
            return {
                ...state,
                total: 0,
                ventas: [],
                venta: undefined
            }
        default:
            return state;
    }
}