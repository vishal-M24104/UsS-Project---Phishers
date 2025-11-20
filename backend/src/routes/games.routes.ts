import { Router } from "express";
import {
    getEmailEasy,
    getEmailHard,
    getEmailMedium,
    getSMSEasy,
    getSMSHard,
    getSMSMedium
} from "../controllers/games.controller";

const router = Router();

router.get("/email/easy", getEmailEasy);
router.get("/email/medium", getEmailMedium);
router.get("/email/hard", getEmailHard);

router.get("/sms/easy", getSMSEasy);
router.get("/sms/medium", getSMSMedium);
router.get("/sms/hard", getSMSHard);

export default router;
