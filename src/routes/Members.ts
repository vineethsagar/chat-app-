import express from 'express';
import Members from '../controllers/Members';

const router = express.Router({ mergeParams: true });
router.get('/', Members.getAllMembers);
router.patch('/', Members.putMember);
router.delete('/', Members.deleteMember);

export = router;
