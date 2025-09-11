import { Router } from "express";
import { createChargeStatic } from "../methods/charge.methods";

const router = Router(); 


router.post('/charge', createChargeStatic);

export default router;
