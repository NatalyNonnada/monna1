import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
    currentValue: number | undefined;
    updatedQuantity: (newValue: number) => void;
    stock: number;
    acstokc: boolean;
}

export const ItemCounter: FC<Props> = ({ currentValue = 0, stock, acstokc, updatedQuantity }) => {

    const addOrRemove = (value: number) => {
        if (value === -1) {
            if (currentValue === 1) return;

            return updatedQuantity(currentValue - 1);
        }
        if (acstokc) {
            if (currentValue + 1 <= stock) {
                updatedQuantity(currentValue + 1);
            }
        } else {
            updatedQuantity(currentValue + 1);
        }

    }


    return (
        <Box display='flex' alignItems='center'>
            <IconButton onClick={() => addOrRemove(-1)}>
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}> {currentValue} </Typography>
            <IconButton onClick={() => addOrRemove(+1)}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
