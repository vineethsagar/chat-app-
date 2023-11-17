import express from 'express';
import Users from '../controllers/Users';

const router = express.Router();
router.get('/all', Users.getAllUsers);
router.get('/:id', Users.getUserById);
router.post('/', Users.createUser);
router.patch('/:id', Users.updateUser);
router.delete('/:id', Users.deleteUser);

export = router;
