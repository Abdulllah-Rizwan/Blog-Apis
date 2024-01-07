import { httpUpdateUserAccountDetails } from '../../controllers/user.controller.js';
import { httpUpdateUserPassword } from '../../controllers/user.controller.js';
import { httpUpdateCoverImage } from '../../controllers/user.controller.js';
import { httpUpdateUserAvatar } from '../../controllers/user.controller.js';
import { httpRegisterUser } from '../../controllers/user.controller.js';
import { httpLogoutUser } from '../../controllers/user.controller.js';
import { httpLoginUser } from '../../controllers/user.controller.js';
import { varifyJWT } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/multer.middleware.js';
import express from 'express';

export const userRouter = express.Router();

userRouter.post("/register",upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]) ,httpRegisterUser);

userRouter.post("/login",httpLoginUser);

// protected routes
userRouter.post("/logout",varifyJWT,httpLogoutUser);
userRouter.patch("/update-password",varifyJWT,httpUpdateUserPassword);
userRouter.patch("/update-account-details",varifyJWT,httpUpdateUserAccountDetails);
userRouter.patch("/update-avatar",varifyJWT,upload.single("avatar"),httpUpdateUserAvatar);
userRouter.patch("/update-coverImage",varifyJWT,upload.single("coverImage"),httpUpdateCoverImage);