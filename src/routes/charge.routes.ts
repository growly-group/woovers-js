import { Router } from "express";
import { createChargeStatic, getCharge, getChargesStatic, deleteCharge } from "../methods/charge.methods";

const router = Router(); 


router.post('/charge', createChargeStatic);
router.get('/charge/:id', getCharge);
router.get('/charge', getChargesStatic);
router.delete('/charge/:id', deleteCharge);


export default router;
