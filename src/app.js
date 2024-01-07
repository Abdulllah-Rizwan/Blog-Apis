import { api } from './routes/api.js';
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

export const app = express();

app.use(helmet());
app.use(morgan("combined"))
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use("/v1", api);
