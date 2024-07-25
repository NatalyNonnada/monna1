import mongoose from 'mongoose';

const mongoConnection = {
    isConnected: 0
}

export const connect = async () => {

    try {
        if (mongoConnection.isConnected) {
            return;
        }

        if (mongoose.connections.length > 0) {
            mongoConnection.isConnected = mongoose.connections[0].readyState;

            if (mongoConnection.isConnected === 1) {
                return;
            }

            await mongoose.disconnect();
        }

        await mongoose.connect(`${process.env.MONGO_URL}` || '');
        mongoConnection.isConnected = 1;

    } catch (error) {
        console.log('dd')
    }
}

export const disconnect = async () => {

    try {
        if (process.env.NODE_ENV === 'development') return;

        if (mongoConnection.isConnected === 0) return;

        await mongoose.disconnect();
        mongoConnection.isConnected = 0;

        console.log('Desconectado');
    } catch (error) {
        console.log('eee')
    }
}


export const checkConnection = async () => {
    if (mongoConnection.isConnected === 1) {
        console.log('Already connected to MongoDB');
        return;
    }

    await connect();
    if (mongoConnection.isConnected === 1) {
        console.log('Successfully connected to MongoDB');
    } else {
        console.log('Failed to connect to MongoDB');
    }
};
