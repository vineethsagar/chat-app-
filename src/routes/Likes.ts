import express from 'express';
import Likes from '../controllers/Likes';
const router = express.Router({ mergeParams: true });
router.get('/', Likes.getAllLikes);
router.post('/', Likes.postLike);
router.delete('/', Likes.deleteLike);

export = router;
