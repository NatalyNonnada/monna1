import { dbUsers } from '../../../database';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
                password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
            },
            async authorize(credentials) {
                return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password) as any;
            }
        }),
    ],
    pages: {
        signIn: '/auth/login',
    },
    session: {
        maxAge: 8 * 60 * 60,
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
