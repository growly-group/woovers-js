import { Router } from "express";
import { createChargeStatic, getCharge } from "../methods/charge.methods";

const router = Router(); 


router.post('/charge', createChargeStatic);
router.get('/charge/:id', getCharge);


export default router;
