var express = require('express');
var app = express();
let Wallet = require('../../blockloan');
let bitcoin = require('bitcoinjs-lib');
let pushtx = require('blockchain.info/pushtx').usingNetwork(3);
var blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3);


/*const bip39 = require('bip39');

const seed = bip39.mnemonicToSeed('erase divert use market vendor fox wall manual eternal demise entire afford');
const master = bitcoin.HDNode.fromSeedBuffer(seed);
let master58 = base58.encode(seed);

console.log('master wif: ',master.keyPair.toWIF());
console.log('master58: ', master58);*/

/* POST users listing. */
app.post('/', function(req, res, next) {
    /*Wallet.all().then(function (obj) {
        let satoshis = 149000;
        let fee = 1000;
        let info = [];
        info[0] = {
            name: obj[0].__name,
            address: obj[0].__address,
            wif:'cNNMiePoWg18eLU2Xda9bjuPYVrs2vNVAjmg4yZScgBxfw9K5tJy',
            network: obj[0].__network,
            password: obj[0].password
        };
        let walletClass = new Wallet(info[0]);
        var key = bitcoin.ECPair.fromWIF(info[0].wif, bitcoin.networks.testnet);
        var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
        tx.addInput("6462159fc0c65675bb6946ec28cdfcc1fbff514dd13bd32947fe2658634f58ed", 1);
        tx.addOutput("mk9w26sgHUNPrePtRNgCqEYL6QEUsjJDPW", satoshis);

        blockexplorer.getUnspentOutputs(info[0].address).then(function (response) {
            info[0].coins = response.unspent_outputs[0].value;
            const change = info[0].coins - (satoshis + fee);
            if (change) tx.addOutput(info[0].address, change);
            tx.sign(0, key);
            let hexTrans = tx.build().toHex();
            console.log('hex: ', hexTrans);

            const promise = pushtx.pushtx(hexTrans);
            const message = 'Transaction Submitted';
            promise.then(result => {
                if (result === message) {
                    console.log(message);
                    res.send('done');
                }
                else { console.log(result); }
            });
        });




    });*/
    res.send('okay');
});

module.exports = app;
