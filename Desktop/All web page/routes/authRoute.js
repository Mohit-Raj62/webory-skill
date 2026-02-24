import express from "express";
import { registerCmntroller } from '../cmntrollers/authcontroller.js';

// Routes obejct..


// routing

// REGISTER || METHOD POST
router.post('/register', registerCmntroller);

export default router;
