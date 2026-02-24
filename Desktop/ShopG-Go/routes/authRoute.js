import express from "express";
import { registerController, loginController, testController, forgotPasswordController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


// routes
const router = express.Router();

// routing routes
// Register routes  || Method POst routes
router.post('/register', registerController);

// Login routes || Method POst routes
router.post('/login', loginController);

// forgot password routes
router.post('/forgotpassword', forgotPasswordController);

// test routes 
router.get('/test', requireSignIn, isAdmin, testController);

//protected  Dash routes || user
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
// protected Dash routes || Admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

export default router;