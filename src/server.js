import { connectToDB } from "./db/mongo.js";
import { app } from "./app.js";
import dotenv from "dotenv";


dotenv.config({path:"./env"});

const PORT = process.env.PORT || 3000;

async function startServer(){
    await connectToDB();
    app.listen(PORT,console.log(`Server is up and running on port ${PORT}`));
}

startServer();