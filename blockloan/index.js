let bip39 = require('bip39');
let bitcoin = require('bitcoinjs-lib');

let crypto = require('crypto');
const hasher = require('./hasher/hasher.util.js');

let EventEmitter = require('events');

let Constants = require('./constants/constants');

let bnet = require('./network/network');
let Database = require('./database/database');

class Wallet extends EventEmitter {

    constructor(info) {
        super();
        this.__name = info.name;
        this.__address = info.address;
        this.__wif = info.wif;
        this.__network = info.network;

        this.__password = info.password || undefined;

        // public
        this.__coins = 0;
        this.__utxos = [];

        this.update();

    }

    /**
     * This will set the unspend outputs as retrieved by the network.
     * It will also parse them to retrieve the total number of coins available to the wallet
     * @param value
     */
    set utxos(value) {
        this.__utxos = value;
        this.__coins = value.reduce((a, c) => a + c.value, 0) / Constants.Bitcoin.Satoshis;
    }

    get utxos() {
        return this.__utxos;
    }

    /**
     * Coins cannot be set explicitly since they are set through assigning unspent outputs
     * @returns {number|*}
     */
    get coins() {
        return this.__coins;
    }

    get name() {
        return this.__name;
    }

    get address() {
        return this.__address;
    }

    get key() {
        return this.address;
    }

    get wif() {
        return this.__wif;
    }

    get network() {
        return this.__network;
    }

    static getTransaction(address) {
        return bnet.api.getTransactions(address).then(function (resp) {
            let transactions = [];
            for (let i in resp) {
                let currentTrans = resp[i];
                if (currentTrans.result < 0) {
                    transactions[i] = {
                        type: "Out",
                        amount: currentTrans.result*(-1)/Constants.Bitcoin.Satoshis,
                        date: "date",
                        time: "time"
                    }
                } else {
                    transactions[i] = {
                        type: "In",
                        amount: currentTrans.result/Constants.Bitcoin.Satoshis,
                        date: "date",
                        time: "time"
                    }
                }
            }
            return transactions;
        });
    }
    /* This hashes the password*/
    static hashIt(password) {
        return hasher.hash(password);
    }

    /**
     * This is irreversible as there is not way to decrypt the wallet for good.
     * The only way to read the key is with the readDecrypted function
     * @param password Cleartext or hashed makes no difference
     * @returns {Wallet} It returns itself
     * @code const wallet = Wallet.create(name, mnemonic).encrypt(password);
     */
    encrypt(password) {
        //if (this.__password) throw new Error('Cannot re-encrypt an encrypted key');
        this.__password = password;
        const cipher = crypto.createCipher(Wallet.Defaults.Encryption, password);
        this.__wif = cipher.update(this.__wif, 'utf8', 'hex') + cipher.final('hex');
        return this;
    }

    encrypt2(hash) {
        this.__password = hash;
        this.__wif = hasher.encrypt(this.__wif, hash);
        return this;
    }

    /**
     * This method will NOT decrypt the wallet but temporarily the key and return it to the calling code
     * This method is NOT symmetrical with the encrypt one.
     * @param password Hashed or not it will be used, it only needs to match the one used in encryption
     * @returns {string} It will not return the wallet itself like the encrypt
     */
    readDecrypted(password) {
        if (!this.__password) throw new Error('Cannot de-encrypt a key that was not encrypted');
        if (!password || !this.matches(password)) throw new Error('Passwords do not match');
        return hasher.decrypt(this.__wif, password)
    }

    matches(password) {
        return password === this.__password;
    }


    send(btc, address, fee, password) {

        const satoshis = Math.round(btc * Constants.Bitcoin.Satoshis);

        const network = bnet.current;

        const txb = new bitcoin.TransactionBuilder(network);

        let current = 0;
        for (const utx of this.utxos) {

            txb.addInput(utx.tx_hash_big_endian, utx.tx_output_n);

            current += utx.value;
            if (current >= (satoshis + fee)) break;
        }

        txb.addOutput(address, satoshis);

        const change = current - (satoshis + fee);
        if (change) txb.addOutput(this.address, change);



        const wif = this.__password ? this.readDecrypted(password) : this.wif;
        const key = bitcoin.ECPair.fromWIF(wif, network);

        txb.sign(0, key);

        const raw = txb.build().toHex();

        return bnet.api.broadcast(raw);
    }


    static get store() {
        if (!Wallet.__store) Wallet.__store = new Database(Wallet.Defaults.DBFileName);
        return Wallet.__store;
    }

    static all() {
        return Wallet.store.find({ network: bnet.name }).then((docs) => {
            return docs.map(doc => new Wallet(doc));
        });
    }


    static generate() {
        return bip39.generateMnemonic();
    }


    static create(name, mnemonic) {

        const seed = bip39.mnemonicToSeed(mnemonic);

        const master = bitcoin.HDNode.fromSeedBuffer(seed, bnet.current);
        const derived = master.derivePath(Wallet.Defaults.Path);
        const address = derived.getAddress();
        const wif = derived.keyPair.toWIF();

        return new Wallet({
            name: name,
            address: address,
            wif: wif,
            network: bnet.name,
        });

    }

    update() {

        return bnet.api.getUnspentOutputs(this.address).then((result) => {
            this.utxos = result.utxos;
            this.emit(Wallet.Events.Updated);
            return true;
        }, (e) => {
            if (e.toString() === Constants.ReturnValues.NoFreeOutputs) {
                this.emit(Wallet.Events.Updated);
            }
        });
    }

    save() {
        return Wallet.store.insert(this.toObject());
    }

    erase() {
        return Wallet.store.remove({ address: this.address });
    }


    toObject() {

        const obj = {
            name: this.name,
            address: this.address,
            wif: this.wif,
            network: this.network,
        };

        if (this.__password) obj.password = this.__password;

        return obj;
    }

    static satoshisConstant() {
        return 100000000;
    }

}

Wallet.Defaults = {
    Encryption: 'aes-256-cbc',
    Path: "m/44'/0'/0'/0/0",
    DBFileName: 'wallets',
};

Wallet.Events = {
    Updated: 'updated',
};


module.exports =  Wallet;
