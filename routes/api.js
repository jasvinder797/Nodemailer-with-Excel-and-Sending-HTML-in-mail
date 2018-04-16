 var express = require('express'),
 router = express.Router();

router.use("/", require("../controllers/mail.api"));
 
module.exports = router;