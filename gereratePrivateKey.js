const util = require('util');

const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

const mnemonic = bip39.generateMnemonic();

const seed = bip39.mnemonicToSeed(mnemonic);
const master = bitcoin.HDNode.fromSeedBuffer(seed);

const derived = master.derivePath("m/44'/0'/0'/0/0");
const address = derived.getAddress();
const privateKey = derived.keyPair.toWIF();

const obj = {
    mnemonic: mnemonic,
    seed: seed,
    master: master,
    derived: derived,
    address: address,
    privateKey: privateKey
};

/*  for short display */
console.log(obj);

/*  for full obj display */
/* console.log(util.inspect(obj, false, null)); */


