import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react'

interface Props {
    loading: boolean;
}

export const LoadingCircular = ({ loading = false }: Props) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}
