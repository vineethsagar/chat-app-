import express from 'express';
import Messages from '../controllers/Messages';

const router = express.Router({ mergeParams: true });
router.get('/', Messages.getAllMessages);
router.post('/', Messages.postMessage);
router.delete('/:messageId', Messages.deleteMessage);

export = router;
