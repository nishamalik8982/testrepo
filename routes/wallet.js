var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('pages/wallet', { title: 'Blockloan Wallet' });
});

module.exports = router;
