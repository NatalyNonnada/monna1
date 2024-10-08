import bcrypt from 'bcryptjs';
import { db } from './';
import { User } from '../model';

export const checkUserEmailPassword = async (email: string, password: string) => {

    try {
        await db.checkConnection();
        const user = await User.findOne({ email });

        if (!user) {
            return null;
        }

        if (!bcrypt.compareSync(password, user.password!)) {
            return null;
        }

        const { role, name, _id } = user;

        return {
            _id,
            email: email.toLocaleLowerCase(),
            role,
            name,
        }
    } catch (error) {
        return null;
    }
}
