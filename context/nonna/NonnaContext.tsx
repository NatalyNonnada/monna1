import { createContext } from 'react';
import { Iservicio, IColaborador } from '../../interface';

export type actionC = 'list' | 'new' | 'edit' | 'view';

interface ContextProps {
    isLoaded: boolean;
    listService: Iservicio[];
    seleService?: Iservicio;
    listContrib: IColaborador[];
    seleContrib?: IColaborador;
    setService: (servicio: Iservicio | Iservicio[], accion: actionC) => void;
    setContrib: (colabora: IColaborador | IColaborador[], accion: actionC) => void;
    setLoading: (estado: boolean) => void;
    clearAllNona: () => void;
}

export const NonnaContext = createContext({} as ContextProps);