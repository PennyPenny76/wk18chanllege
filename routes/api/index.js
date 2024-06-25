const router = require('express').Router();
const courseRoutes = require('./thoughteRoutes');
const studentRoutes = require('./userRoutes');

router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;
