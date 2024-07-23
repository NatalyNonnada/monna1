import { ChangeEvent } from 'react';
import { FormControl, TextField, Typography } from '@mui/material';

interface Props {
    children: any,
    handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
    sear: string;
}

export const BusquedaIten = ({ children, handleSearchChange, sear }: Props) => {
    return (

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>
                {children}
            </div>

            <Typography component='div' sx={{ width: { sm: '60%', md: '70%', lg: '80%' } }}>
                <FormControl fullWidth sx={{ m: 1 }}>
                    <TextField
                        fullWidth
                        label='Buscar'
                        name='buscar'
                        value={sear}
                        onChange={handleSearchChange}
                    />
                </FormControl>
            </Typography>
        </div>
    )
}
