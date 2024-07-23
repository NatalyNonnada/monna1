import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LaunchIcon from '@mui/icons-material/Launch';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import { IPages } from '../interface';

interface SeedData {
    navbarp: IPages[];
    categorias: IPages[];
    turnoma: string[];
    turnotar: string[];
    pagos: string[];
}

export const listPages: SeedData = {
    navbarp: [
        {
            name: 'Inicio',
            ruta: '/nonna',
            icon: HomeIcon
        },
        {
            name: 'Ordenes',
            ruta: '/nonna/ordenes',
            icon: PanToolAltIcon
        },
        {
            name: 'Servicios',
            ruta: '/nonna/servicios',
            icon: LaunchIcon
        },
        {
            name: 'Reservas',
            ruta: '/nonna/reservas',
            icon: LaunchIcon
        },
        {
            name: 'Colaboradores',
            ruta: '/nonna/colaboradores',
            icon: LaunchIcon
        },
    ],
    categorias: [
        {
            name: 'Promo del mes',
            ruta: ''
        },
        {
            name: 'Manicure',
            ruta: ''
        },
        {
            name: 'Pedicure',
            ruta: ''
        },
        {
            name: 'Cejas',
            ruta: ''
        },
        {
            name: 'Pestañas',
            ruta: ''
        },
        {
            name: 'Adicionales',
            ruta: ''
        },
    ],
    turnoma: ["9:15 am", "9:30 am", "9:45 am", "10:00 am", "10:15 am", "10:30 am", "10:45 am", "11:00 am", "11:15 am", "11:30 am", "11:45 am"],
    turnotar: ["3:15 pm", "3:30 pm", "3:45 pm", "4:00 pm", "4:15 pm", "4:30 pm", "4:45 pm", "5:00 pm", "5:15 pm", "5:30 pm", "5:45 pm"],
    pagos: ["Yape", "Plin", "Efectivo", "Deposito", "Transferencia"]
};
