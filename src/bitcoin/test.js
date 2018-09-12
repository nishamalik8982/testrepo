let chain = require('../../blockloan/network/network');

let address = 'mvb5fWWTAEz1S1E7NRU1DKm8BMvojMaTqQ';

chain.api.getTransactions(address).then(function (resp) {
    let transactions = [];
    for (let i in resp) {
        let currentTrans = resp[i];
        console.log(currentTrans)
        if (currentTrans.result < 0) {
            transactions[i] = {
                type: "Out",
                amount: currentTrans.result*(-1),
                date: "date",
                time: "time"
            }
        } else {
            transactions[i] = {
                type: "In",
                amount: currentTrans.result,
                date: "date",
                time: "time"
            }
        }
    }
    //console.log(transactions);
});