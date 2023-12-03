// const Blockchain = require ('./blockchain/blockchain')

// const blockchain = new Blockchain();

// for (let i=0; i<10; i++) {
//     console.log(blockchain.addBlock(`Cat ${i}`))
// }

const Wallet = require('./wallet/wallet')

const wallet = new Wallet();
console.log(wallet.toString())