var express = require('express');
var app = express();
let Wallet = require('../../blockloan');

/* POST users listing. */
app.post('/', function(req, res, next) {
    if (req.body.pswd !== req.body.conf_pswd) {
        res.redirect('/wallet/bitcoin',{"response": "Passwords have to match!"});
    } else {
        // Get Mnemonic
        const mnemonic = Wallet.generate();
        // Hash password
        Wallet.hashIt(req.body.pswd)
            .then(function (hash) {
                // create wallet and encrypt it
                const wallet = Wallet.create(req.body.name, mnemonic).encrypt2(hash);
                // Store wallet in DB
                wallet.save();
                // redirect user to page
                res.redirect('/wallet/bitcoin', {
                    url: req.url,
                    id: "thank_you"
                }, function(err, html){
                    if (err) {
                        console.err("ERR", err);

                        // An error occurred, stop execution and return 500
                        return res.status(500).send();
                    }

                    // Return the HTML of the View
                    return res.send(html);
                });
            });
    }
});

module.exports = app;
