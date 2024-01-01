import {userRouter} from './users/user.route.js';
import express from 'express';

export const api = express.Router();

api.use('/users',userRouter);