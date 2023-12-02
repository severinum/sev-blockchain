const { INITIAl_BALANCE } = require('../config')
const ChainUtils = require('../chain-util');
const Transaction = require('./transaction');

class Wallet {

    constructor(publicKeyString = null, privateKeyString = null) {
        this.balance = INITIAl_BALANCE
        if(publicKeyString === null && privateKeyString === null) {
            this.keyPair = ChainUtils.genKeyPair(); // genetate pair of keys
            
        } else {
            // case when user has wallet and wallet must be created from KeyPair
            this.keyPair = ChainUtils.createKeyPairFromStringKeys(publicKeyString, privateKeyString)
            // TODO: if wallet exists , set the wallet balance by scanning all blockchain transactions
            
        }
        this.publicKey = this.keyPair.getPublic().encode('hex'); // get the public kye but as hex   
    }

    getPrivateKeyAsHexString() {
        return this.keyPair.getPrivate('hex')
    }

    getPublicKeyAsHexString() {
        return this.publicKey;
    }

    toString() {
        return `Wallet - 
            publicKey      : ${this.publicKey.toString()}
            balance        : ${this.balance}`
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash)
    }

    createTransaction(recipient, amount, transactionPool) {
        if (amount > this.balance) {
            console.log(`Amount: ${amount} is too high for current wallet balance: ${this.balance}`)
            return
        }

        // check if sender transaction exists in the pool already
        let transaction = transactionPool.existingTransaction(this.publicKey)
        if (transaction) {
            transaction.update(this, recipient, amount)
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount)
            transactionPool.updateOrAddTransaction(transaction)
        }

        return transaction
    }

}
module.exports = Wallet