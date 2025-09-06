import { Router } from 'express';
import { listItems, createItem } from '../controllers/itemController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listItems);
router.post('/', requireAuth, createItem);

export default router;
