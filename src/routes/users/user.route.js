import {httpRegisterUser} from '../../controllers/user.controller.js';
import {upload} from '../../middleware/multer.middleware.js';
import express from 'express';

export const userRouter = express.Router();

userRouter.post("/register",upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]) ,httpRegisterUser);