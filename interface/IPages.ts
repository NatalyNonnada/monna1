import { FunctionComponent } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';

export type MuiIcon = FunctionComponent<SvgIconProps>;

export interface IPages {
    name: string;
    ruta: string;
    icon?: any;
    image?: string;
}
