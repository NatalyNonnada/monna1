import { FC, useReducer } from 'react';
import { IColaborador, Iservicio } from '../../interface';
import { actionC, NonnaContext } from './NonnaContext';
import { nonnaReducer } from './nonnaReducer';

export interface NonnaState {
    isLoaded: boolean;
    //servicios
    listService: Iservicio[];
    seleService?: Iservicio;
    //colaboradores
    listContrib: IColaborador[];
    seleContrib?: IColaborador;
}

const NONNA_INITIAL_STATE: NonnaState = {
    isLoaded: false,
    listService: [],
    listContrib: [],
}

interface Props {
    children: any
}

export const NonnaProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(nonnaReducer, NONNA_INITIAL_STATE);

    const setService = (servicio: Iservicio | Iservicio[], accion: actionC) => {
        switch (accion) {
            case 'list':
                {
                    dispatch({ type: '[Servi] - Load servicios', payload: servicio as Iservicio[] });
                    return;
                }
            case 'edit':
                {
                    dispatch({ type: '[Servi] - Edit servicio', payload: servicio as Iservicio });
                    return;
                }
            case 'new':
                {
                    dispatch({ type: '[Servi] - New servicio', payload: servicio as Iservicio });
                    return;
                }
            case 'view':
                {
                    dispatch({ type: '[Servi] - View servicio', payload: servicio as Iservicio });
                    return;
                }
            default:
                return;
        }
    }

    const setContrib = (colabora: IColaborador | IColaborador[], accion: actionC) => {
        switch (accion) {
            case 'list':
                {
                    dispatch({ type: '[Calab] - Load colaboradores', payload: colabora as IColaborador[] });
                    return;
                }
            case 'edit':
                {
                    dispatch({ type: '[Calab] - Edit colaborado', payload: colabora as IColaborador });
                    return;
                }
            case 'new':
                {
                    dispatch({ type: '[Calab] - New colaborado', payload: colabora as IColaborador });
                    return;
                }
            case 'view':
                {
                    dispatch({ type: '[Calab] - View colaborador', payload: colabora as IColaborador });
                    return;
                }
            default:
                return;
        }
    }

    const setLoading = (estado: boolean) => {
        dispatch({ type: '[Nonna] - Loading', payload: estado });
        return;
    }

    const clearAllNona = () => {
        dispatch({ type: '[Clear] - Nona' });
    }

    return (
        <NonnaContext.Provider value={{
            ...state,
            clearAllNona,
            setContrib,
            setService,
            setLoading
        }}>
            {children}
        </NonnaContext.Provider>
    )
}