import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const mongoInstance = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connection successfuly Establish host id: ${mongoInstance.connection.host}`);

    } catch (error) {
        mongoose.connection.on("error",() => console.error(`Error whilst establishing connection to a DB ${error}`));
        process.exit(1);
    
    }
}