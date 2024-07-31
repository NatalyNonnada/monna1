import React from 'react';
import { IVenta } from '../../../interface';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { priceBodyTemplate } from '../../../utils';

interface Props {
    ventas: IVenta[];
    subTotalg: number;
    total: number;
    desc: number;
}

export const TableSale = ({ ventas, subTotalg = 0, desc = 0, total = 0, }: Props) => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell className='tablefon' style={{ fontWeight: 'bold' }}>Servicio</TableCell>
                        <TableCell className='tablefon' style={{ fontWeight: 'bold' }} align="center">Cantidad</TableCell>
                        <TableCell className='tablefon' style={{ fontWeight: 'bold' }} align="left">Precio</TableCell>
                        <TableCell className='tablefon' style={{ fontWeight: 'bold' }} align="left">SubTotal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ventas.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell className='tablefon'>{row.servicio}</TableCell>
                            <TableCell className='tablefon' align="center">{row.quanty}</TableCell>
                            <TableCell className='tablefon' align="left">{priceBodyTemplate({ price: `${row.total}` })}</TableCell>
                            <TableCell className='tablefon' align="left">{priceBodyTemplate({ price: `${row.total * row.quanty}` })} </TableCell>
                        </TableRow>
                    ))}
                    <TableRow className='bor'>
                        <TableCell className='tablefon' colSpan={3} style={{ fontWeight: 'bold' }} >SubTotal</TableCell>
                        <TableCell className='tablefon' style={{ fontWeight: 'bold' }} align="left">{priceBodyTemplate({ price: `${subTotalg}` })}</TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell className='tablefon' colSpan={3} style={{ fontWeight: 'bold' }} >Descuento</TableCell>
                        <TableCell className='tablefon' style={{ fontWeight: 'bold' }} align="left">{priceBodyTemplate({ price: `${desc}` })}</TableCell>
                    </TableRow>
                    <TableRow className='bor'>
                        <TableCell className='tablefon' colSpan={3} style={{ fontWeight: 'bold' }} >Total</TableCell>
                        <TableCell className='tablefon' style={{ fontWeight: 'bold' }} align="left">{priceBodyTemplate({ price: `${total}` })}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}
