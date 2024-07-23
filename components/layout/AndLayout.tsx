import Head from 'next/head';
import { FC } from 'react';
import { Navbar, SideMenu } from '..';

interface Props {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
    children: React.ReactNode;
}

export const AndLayout: FC<Props> = ({ children, title, pageDescription }) => {
    return (
        <>
            <Head>
                <meta name="robots" content='index,follow' />

                <meta name="description" content={pageDescription} />
                <meta name="og:title" content={title} />
                <meta name="og:description" content={pageDescription} />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta name="og:image" content={`${process.env.NEXT_PUBLIC_URL}/logo-monna.svg`} />
                <meta property="og:type" content="website" />
                <meta property="og:image:alt" content="Monna" />
                <meta property="og:site_name" content="NONNA" />
                <meta property="og:locale" content="es_ES" />
                <meta property="og:image:type" content="image/svg" />
                <meta property="og:image:width" content="300" />
                <meta property="og:image:height" content="200" />

                <meta name="twitter:card" content={pageDescription} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_URL}/logo-monna.svg`} />
                <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
            </Head>

            <nav>
                <Navbar />
            </nav>
            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
            }}>
                {children}
            </main>
            <footer>
                <p style={{ color: 'black', textAlign: 'center' }}>© 2024 | cincout.technology@gmail.com </p>
            </footer>
        </>
    )
}
