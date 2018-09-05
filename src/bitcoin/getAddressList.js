var express = require('express');
var app = express();
let Wallet = require('../../blockloan');
var blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3);
var exchange = require('blockchain.info/exchange');


/* POST users listing. */
app.post('/', function(req, res, next) {
    Wallet.all().then(function (obj) {

        let wallet = [];
        wallet[0] = {
            name: obj[0].__name,
            address: obj[0].__address,
            network: obj[0].__network
        };

        wallet[1] = {
            name: obj[1].__name,
            address: obj[1].__address,
            network: obj[1].__network,
            coins: 0,
            fiat: 0
        };

        blockexplorer.getUnspentOutputs(wallet[0].address).then(function (response) {
            wallet[0].coins = response.unspent_outputs[0].value / 100000000;
            exchange.fromBTC(response.unspent_outputs[0].value, 'USD').then(function (fiatResp) {
                wallet[0].fiat = fiatResp;
                res.send(wallet);
            });
        });

       /* blockexplorer.getUnspentOutputs(wallet[1].address).then(function (response2, err) {
            console.log(response2);
            if (!err) {
                wallet[1].coins = response2.unspent_outputs[0].value / 100000000;
                console.log(wallet[1].coins);
                exchange.fromBTC(response2.unspent_outputs[0].value, 'USD').then(function (fiatResp2) {
                    wallet[1].fiat = fiatResp2;
                    console.log(wallet);
                    res.send(wallet);
                });
            } else {
                wallet[1].coins = 0;
                wallet[1].fiat = 0;
            }

        });*/

    });
});

module.exports = app;
