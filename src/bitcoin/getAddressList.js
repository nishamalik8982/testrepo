var express = require('express');
var app = express();
let Wallet = require('../../blockloan');
let bnet = require('../../blockloan/network/network');

let wallet = {};
/* POST users listing. */
app.post('/', function(req, res, next) {
    // Get wallet info (address, ...)
    Wallet.all()
        .then(function (obj) {
            if (obj && !obj.length) {
                let addNew = '<button class="add-new popup" id="addNewWallet" onclick="openForm(\'form-wrapper\'); clearText(\'responseArea\')">Create new</button>';
                res.send(addNew);
                throw new Error('database has no address');
                return null;
            }
            // Update wallet obj
            wallet = {
                name: obj[0].__name,
                address: obj[0].__address,
                network: obj[0].__network
            };
            // Return transactions associated with that address
            return Wallet.getTransaction(wallet.address).then(function (trans) {return trans});
        })
        .then(function (transactions) {
            // Pre allocate zero balance
            wallet.coins = 0;
            wallet.fiat = 0;
            // If N. of trans is > 0 then update balance accordingly
            if (transactions && transactions.length) {
                let transTable = [];
                // Prepare transactions table
                for (let t in transactions) {
                    transTable.push('<tr><td>' + transactions[t].date + '</td><td>' + transactions[t].time + '</td><td>' + transactions[t].type + '</td><td>' + transactions[t].amount + '</td></tr>')
                }
                // Return balance
                return bnet.api.getUnspentOutputs(wallet.address).then(function (unspent) {
                    wallet.coins = unspent.coins;
                    // Get bitcoin price
                    bnet.api.getPrice('BTC').then(function (price) {
                        // Update wallet obj
                        wallet.fiat = (wallet.coins * price.USD.last).toFixed(2);
                        if (wallet.name && wallet.name.length) {
                            let obj = {
                                title : 'Bitcoin Wallet',
                                table : '<table style =\"\"><tbody><tr><th>Name</th><th>Address</th><th>Network</th></tr><tr><td>' + wallet.name + '</td><td>' + wallet.address + '</td><td>' + wallet.network + '</td></tr></tbody></table>',
                                buttons : '<div style=\"vertical-align: top; padding: 0 0 0 40px;\"><button onclick="openForm(\'transactionFormWrapper\')" class=\"spend-button\">P</button><button onclick=\"deleteAddress(\'transactionFormWrapper\')\" class=\"delete-address\">X</button></div>',
                                addNew: '<button class="add-new popup" id="addNewWallet" onclick="openForm(\'form-wrapper\'); clearText(\'responseArea\')">Create new</button>',
                                balance : wallet.coins + ' BTC / ' + wallet.fiat + ' $',
                                transactions: transTable
                            };
                            res.send(obj);
                        } else {
                            res.render('pages/bitcoin', {response: 'something went wrong'});
                        }
                    });
                });
            } else {
                // Prepare html table to render
                if (wallet.name && wallet.name.length) {
                    let obj = {
                        title : 'Bitcoin Wallet',
                        table : '<table style =\"\"><tbody><tr><th>Name</th><th>Address</th><th>Network</th></tr><tr><td>' + wallet.name + '</td><td>' + wallet.address + '</td><td>' + wallet.network + '</td></tr></tbody></table>',
                        buttons : '<div style=\"vertical-align: top; padding: 0 0 0 40px;\"><button onclick="openForm(\'transactionFormWrapper\')" class=\"spend-button\">P</button><button onclick=\"deleteAddress(\'transactionFormWrapper\')\" class=\"delete-address\">X</button></div>',
                        addNew: '<button class="add-new popup" id="addNewWallet" onclick="openForm(\'form-wrapper\'); clearText(\'responseArea\')">Create new</button>',
                        balance : wallet.coins + ' BTC / ' + wallet.fiat + ' $',
                        transactions: [],
                        message: "-- No transactions found until now --"
                    };
                    res.render('pages/bitcoin', {
                        url: req.url,
                        id: "thank_you"
                    }, function(err, html){
                        if (err) {
                            console.err("ERR", err)

                            // An error occurred, stop execution and return 500
                            return res.status(500).send();
                        }

                        // Return the HTML of the View
                        return res.send(obj);
                    });
                    //res.send(obj);
                } else {
                    res.render('pages/bitcoin', {response: 'something went wrong'});
                }

            }
        })
        .catch(function(err) {
            console.log(err)
            res.end();
        });
});

module.exports = app;
