const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createUserThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController.js');

router.route('/')
.get(getThoughts)
.post(createUserThought)

// /api/:thoughtId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router.route('/:thoughtId/reactions')
  .post(addReaction)

router.route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);

module.exports = router;
