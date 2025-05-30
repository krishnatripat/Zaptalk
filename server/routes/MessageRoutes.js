    import { Router } from "express";
    import { addMessage, getmessages ,addImageMessage, addAudioMessage, getInitialContactswithMessages} from "../controllers/MessageController.js";
    import multer from 'multer'
    const router = Router();
    const upload=multer({dest:"uploads/recordings"})
    const uploadImage=multer({dest:"uploads/images"})
    router.post("/add-messages", addMessage);
    router.get("/get-messages/:from/:to", getmessages);
    router.post("/add-image-message",uploadImage.single("image"),addImageMessage)
    router.post("/add-audio-message",upload.single("audio"),addAudioMessage)
    router.get("/get-initial-contacts/:from",getInitialContactswithMessages)
    export default router