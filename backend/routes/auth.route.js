import express from "express";
const router = express.Router();
import {signup , login , logout , verifyEmail} from '../controllers/Auth.js'

router.post('/signup' , signup)
router.get('/login' , login)
router.get('/logout' , logout)
router.post('/verify-email' , verifyEmail)

export default router ;