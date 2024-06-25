const router = require('express').Router();
const {
  getThought,
  getSingleThought,
  createUserThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController.js');

// /api/users/:userId/friends/:friendId
router.route('/')
.get(getThought)


// /api/:thoughtId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .post(createUserThought)
  .put(updateThought)
  .delete(deleteThought);

router.route('/api/thoughts/:thoughtId/reactions')
  .post(addReaction)
  .delete(removeReaction);

module.exports = router;
