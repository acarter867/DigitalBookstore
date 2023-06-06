const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
    res.send("IT WORKSSSSSSS");
});


module.exports = router;