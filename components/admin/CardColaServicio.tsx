import { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import { CardModalServicio } from './colaServicio/CardModalServicio';
import { Add } from '@mui/icons-material';

interface bodyre {
    id: string;
    lstservicios: string[];
}

interface Props {
    id: string;
    category: string[];
    handleLoging: (value: boolean) => void;
    addServicios: (value: bodyre) => Promise<{
        hasError: boolean;
    }>
}

export const CardColaServicio = ({ category, id, addServicios, handleLoging }: Props) => {

    const [openSer, setOpenSer] = useState(false);

    const handleClose = () => {
        setOpenSer(false)
    }

    return (
        <div style={{ cursor: 'pointer' }}>
            <Typography style={{ fontSize: '17px', fontWeight: '700' }}>
                Colabora en:
                <IconButton onClick={() => setOpenSer(true)}>
                    <Add />
                </IconButton>
            </Typography>
            {
                category.map(da => (
                    <div key={da} className='eguxKp'>
                        <Typography>{da}</Typography>
                    </div>
                ))
            }
            {openSer && (
                <CardModalServicio
                    id={id} open={openSer}
                    category={category}
                    handleClose={handleClose}
                    addServicios={addServicios}
                    handleLoging={handleLoging}
                />)}
        </div>
    )
}
