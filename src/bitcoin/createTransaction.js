var express = require('express');
var app = express();
let Wallet = require('../../blockloan');

/* POST users listing. */
app.post('/', function(req, res, next) {
    console.log(req.url);
    Wallet.all().then(function (obj) {
        let fee = 1000;
        let info = obj[0];
        let walletContent = {
            name:     info.name,
            address:  info.__address,
            wif:      info.__wif,
            network:  info.__network,
            password: info.__password
        };

        // Class instance
        let wallet = new Wallet(walletContent);
        wallet.update().then(function () {
            Wallet.hashIt(req.body.psw).then(function (hashed) {
                // Prepare and push transaction to the network
                wallet.send(req.body.amount,req.body.address,fee,hashed).then(function (response) {
                    console.log("response: ", response);
                    res.redirect('/wallet/bitcoin', {
                        url: req.url,
                        id: "transaction_sent"
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
            });
        })
        // Verify password
    });
});

module.exports = app;
