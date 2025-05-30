import {Router} from 'express';
import { checkUser, getAllUsers, generateToken, onBoardUser } from "../controllers/AuthController.js";
const router=Router();
router.post("/check-user",checkUser);
router.post("/onboard-user",onBoardUser)
router.get("/get-contacts",getAllUsers)
/
  
// router.get("/generate-token/:usreId",generateToken);
router.get("/generate-token/:userId", generateToken);    
// router.get("/generate-token", generateToken);


export  default router;