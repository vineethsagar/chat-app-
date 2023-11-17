import express from 'express';
import groupController from '../controllers/Groups';
const router = express.Router();
router.get('/', groupController.getAllGroups);
router.get('/:groupId', groupController.getGroupById);
router.post('/', groupController.createGroup);
router.patch('/:groupId', groupController.updateGroup);
router.delete('/:groupId', groupController.deleteGroup);

export = router;
