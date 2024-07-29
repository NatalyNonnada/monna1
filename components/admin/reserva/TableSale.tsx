import React from 'react';
import { IVenta } from '../../../interface';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { priceBodyTemplate } from '../../../utils';

interface Props {
    ventas: IVenta[];
    subTotal: number;
}

export const TableSale = ({ ventas, subTotal }: Props) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell>Servicio</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell align="left">Precio</TableCell>
                        <TableCell align="left">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ventas.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell>{row.servicio}</TableCell>
                            <TableCell align="center">{row.quanty}</TableCell>
                            <TableCell align="left">{priceBodyTemplate({ price: `${row.total}` })}</TableCell>
                            <TableCell align="left">{priceBodyTemplate({ price: `${row.total * row.quanty}` })}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={3}>SubTotal</TableCell>
                        <TableCell align="left">{priceBodyTemplate({ price: `${subTotal}` })}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}
