import { Router } from "express";
import { createChargeStatic, getCharge, getChargesStatic } from "../methods/charge.methods";

const router = Router(); 


router.post('/charge', createChargeStatic);
router.get('/charge/:id', getCharge);
router.get('/charge', getChargesStatic);


export default router;
