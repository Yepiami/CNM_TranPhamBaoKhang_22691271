
import { Router } from 'express';
import { upload } from '../services/storage.local.js';
import {
    listPage, newPage, createAction,
    editPage, updateAction, deleteAction
} from '../controllers/products.controller.js';

const router = Router();

router.get('/', listPage);
router.get('/new', newPage);
router.post('/new', upload.single('image'), createAction);

router.get('/:id/edit', editPage);
router.post('/:id/edit', upload.single('image'), updateAction);

router.post('/:id/delete', deleteAction);

export default router;
