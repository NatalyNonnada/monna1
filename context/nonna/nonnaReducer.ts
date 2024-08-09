import { IColaborador, Iservicio } from '../../interface';
import { NonnaState } from './NonnaProvider';

type NonnaActionType =
    | { type: '[Nonna] - Loading', payload: boolean }
    | { type: '[Calab] - Load colaboradores', payload: IColaborador[] }
    | { type: '[Calab] - New colaborado', payload: IColaborador }
    | { type: '[Calab] - Edit colaborado', payload: IColaborador }
    | { type: '[Calab] - Remove colaborado', payload: IColaborador }
    | { type: '[Calab] - View colaborador', payload: IColaborador }
    | { type: '[Servi] - Load servicios', payload: Iservicio[] }
    | { type: '[Servi] - New servicio', payload: Iservicio }
    | { type: '[Servi] - Edit servicio', payload: Iservicio }
    | { type: '[Servi] - Remove servicio', payload: Iservicio }
    | { type: '[Servi] - View servicio', payload: Iservicio }
    | { type: '[Clear] - Nona' }

export const nonnaReducer = (state: NonnaState, action: NonnaActionType): NonnaState => {

    switch (action.type) {

        case '[Nonna] - Loading':
            return {
                ...state,
                isLoaded: action.payload
            }
        //Colaboradores
        case '[Calab] - Load colaboradores':
            return {
                ...state,
                listContrib: action.payload
            }
        case '[Calab] - New colaborado':
            const exists = state.listContrib.some(event => event._id === action.payload._id);

            if (exists) {
                return state;
            }

            return {
                ...state,
                listContrib: [...state.listContrib, action.payload]
            }
        case '[Calab] - Edit colaborado':

            const updatedDepart = state.listContrib.map(event => {
                if (event._id !== action.payload._id) return event;
                return action.payload;
            });

            if (!updatedDepart.find(event => event._id === action.payload._id)) {
                updatedDepart.push(action.payload);
            }

            return {
                ...state,
                listContrib: updatedDepart
            }

        case '[Calab] - Remove colaborado':
            return {
                ...state,
                listContrib: state.listContrib.filter(event => event._id !== action.payload._id)
            }

        case '[Calab] - View colaborador':
            return {
                ...state,
                seleContrib: { ...action.payload }
            }
        case '[Servi] - Load servicios':
            return {
                ...state,
                listService: action.payload
            }
        case '[Servi] - New servicio':
            const existser = state.listService.some(event => event._id === action.payload._id);

            if (existser) {
                return state;
            }

            return {
                ...state,
                listService: [...state.listService, action.payload]
            }
        case '[Servi] - Edit servicio':

            const updatedService = state.listService.map(event => {
                if (event._id !== action.payload._id) return event;
                return action.payload;
            });

            if (!updatedService.find(event => event._id === action.payload._id)) {
                updatedService.push(action.payload);
            }

            return {
                ...state,
                listService: updatedService
            }

        case '[Servi] - Remove servicio':
            return {
                ...state,
                listService: state.listService.filter(event => event._id !== action.payload._id)
            }
        case '[Servi] - View servicio':
            return {
                ...state,
                seleService: { ...action.payload }
            }
        case '[Clear] - Nona':
            return {
                ...state,
                isLoaded: false,
                seleService: undefined,
                seleContrib: undefined,
                listService: [],
                listContrib: [],
            }
        default:
            return state
    }
}
