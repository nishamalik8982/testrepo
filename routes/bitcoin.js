var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('pages/bitcoin', { title: 'Bitcoin Wallet' });
});

module.exports = router;
