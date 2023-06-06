const router = require("express").Router();

const homeRoutes = require("./home-routes.js");
//const downloadRoutes = require('./downloads/download.js');
const uploadRoutes = require('./uploads/upload.js');
const userRoutes = require('./user/user-routes.js');
const searchRoutes = require('./search/search-routes.js');

router.use("/", homeRoutes);
//router.use('/download', downloadRoutes);
router.use('/upload', uploadRoutes);
router.use('/user', userRoutes);
router.use('/search', searchRoutes);

module.exports = router;