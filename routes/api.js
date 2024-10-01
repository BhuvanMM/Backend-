import AuthController from "../controllers/authController.js";
import {Router} from 'express';
import { authenticate } from "../middleware/authMiddleware.js";
import ProfileController from "../controllers/profileController.js";
import NewsController from "../controllers/newsController.js";
import redisCache from "../Database/redisConfig.js";

const router = Router();

router.post('/auth/register',AuthController.register)
router.post('/auth/login',AuthController.login)
router.get('/profile',authenticate,ProfileController.index)

//news routes
router.get('/news',redisCache.route(), NewsController.index)
router.post('/news',authenticate,NewsController.store)
router.get('/news/:id',redisCache.route(),NewsController.show)
router.put('/news/:id',authenticate,NewsController.update)
router.delete('/news/:id',authenticate,NewsController.destory)

router.get('/send-email',AuthController.sendTestEmail);

export default router;