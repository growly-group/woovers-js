import { getQrCodeStaticByID, getQrCodeStatic } from "../methods/pixqrcode.methods";
import Router from 'express';

const router= Router();

router.get('qrcode-static/:id', getQrCodeStaticByID);

router.get('qrcode-static/', getQrCodeStatic);

router.post('qrcode-static/', );

export default router;