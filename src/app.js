import {api }from './routes/api.js'
import express from "express";
import helmet from "helmet";

export const app = express();

app.use(helmet());
app.use("/v1",api);
app.use(express.static("public"));
app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:true,limit:"20kb"}));