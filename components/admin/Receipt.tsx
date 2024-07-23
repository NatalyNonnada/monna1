import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IVenta } from '../../interface';
import { priceBodyTemplate } from '../../utils';
import { Button } from '@mui/material';

interface IReceiptProps {
    items: IVenta[];
    total: number;
    date: string;
    customerName: string;
}

export const Receipt: React.FC<IReceiptProps> = ({ items, total, date, customerName }) => {
    const generatePDF = async () => {
        const element = document.getElementById('receipt-content');
        if (element) {
            const canvas = await html2canvas(element, { scale: 4 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 80]
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const logoUrl = '/logo-monna.png';
            const logoImg = new Image();
            logoImg.src = logoUrl;
            logoImg.onload = () => {
                pdf.addImage(logoImg, 'PNG', 27, 1, 50, 15);
                pdf.save('receipt.pdf');
            };
        }
    };

    return (
        <div>
            <div id="receipt-content" style={{ maxWidth: '600px', margin: '0px auto' }}>
                <div style={{ padding: '20px' }}>
                    <h1>MONNA</h1>
                    <p>Fecha: {date}</p>
                    <p>Nombre del Cliente: {customerName}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', padding: '8px 0' }}>
                        <span style={{ fontWeight: 'bold' }}>Descripción</span>
                        <span style={{ fontWeight: 'bold' }}>Precio</span>
                    </div>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '8px 0' }}>
                            <span>{item.servicio}</span>
                            <span>{priceBodyTemplate({ price: `${item.total}` })}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold' }}>
                        <span>Total:</span>
                        <span>{priceBodyTemplate({ price: `${total}` })}</span>
                    </div>
                </div>
            </div>
            <Button variant='contained' color='success' onClick={generatePDF}>Finalizar servicio</Button>
        </div>
    );
};

