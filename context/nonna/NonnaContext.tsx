import { createContext } from 'react';
import { Iservicio, IColaborador } from '../../interface';

export type actionC = 'list' | 'new' | 'edit' | 'view';

interface ContextProps {
    isLoaded: boolean;

    //servicios
    listService: Iservicio[];
    seleService?: Iservicio;
    //colaboradores
    listContrib: IColaborador[];
    seleContrib?: IColaborador;
    // Methods
    setService: (servicio: Iservicio | Iservicio[], accion: actionC) => void;
    setContrib: (colabora: IColaborador | IColaborador[], accion: actionC) => void;
    setLoading: (estado: boolean) => void;
}

export const NonnaContext = createContext({} as ContextProps);