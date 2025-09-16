import { Router } from "express";
import { createChargeStatic, getCharge, getChargesStatic, deleteCharge, updateExpiresDate } from "../methods/charge.methods";

const router = Router(); 


router.post('/charge', createChargeStatic);
router.get('/charge/:id', getCharge);
router.get('/charge', getChargesStatic);
router.delete('/charge/:id', deleteCharge);
router.patch('/charge/:id', updateExpiresDate);


export default router;
