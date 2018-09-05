var express = require('express');
var app = express();
let Wallet = require('../../blockloan');

/* POST users listing. */
app.post('/', function(req, res, next) {
    /*let info = {
        name: req.body.name,
        address: '',
        wif: '',
        network: 'testnet',
        password: req.body.pswd
    };*/

    // Get Mnemonic
    const mnemonic = Wallet.generate();
    // create wallet and encrypt it
    const wallet = Wallet.create(req.body.name, mnemonic).encrypt(req.body.pswd);
    // Store wallet in DB
    wallet.save();

    res.render('pages/bitcoin', { title: 'Bitcoin Wallet' });
});

module.exports = app;
