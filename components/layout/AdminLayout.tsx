import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { AdminNavbar } from '../ui';

interface Props {
    title: string;
    subTitle: string;
    children: any;
    icon?: JSX.Element;
}

export const AdminLayout: FC<Props> = ({ children, title, subTitle, icon }) => {
    return (
        <>
            <nav>
                <AdminNavbar />
            </nav>
            {/* <SideMenu /> */}

            <main style={{
                margin: '60px 0 auto',
                maxWidth: '1440px',
                padding: '0px 0px 35px 15px',
                backgroundColor: 'rgb(240 240 240)'
            }}>
                <Box display="flex" flexDirection='column' className='animate__animated animate__fadeIn'>
                    <br />
                    <Typography variant='h1' component='h1'>
                        {icon}
                        {' '} {title}
                    </Typography>
                    <Typography variant='h2' sx={{ mb: 1 }}>{subTitle}</Typography>
                </Box>
                <Box className='animate__animated animate__fadeIn'>
                    {children}
                </Box>
            </main>
        </>
    )
}
