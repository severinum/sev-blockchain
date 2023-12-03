const { INITIAl_BALANCE } = require('../config')
const ChainUtils = require('../chain-util');
const Transaction = require('./transaction');

class Wallet {

    constructor(publicKeyString = null, privateKeyString = null) {
        this.balance = INITIAl_BALANCE
        if (publicKeyString === null && privateKeyString === null) {
            this.keyPair = ChainUtils.genKeyPair(); // genetate pair of keys as this is a new wallet
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

    createTransaction(recipient, amount, blockchain, transactionPool) {
        
        this.balance = this.claculateBalance(blockchain)

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

    claculateBalance(blockchain) {
        let balance = this.balance
        let transactions = []
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction)
        }))

        const walletInputTransactions =
            transactions.filter(transaction => transaction.input.address === this.publicKey)

        let startTime = 0

        if (walletInputTransactions.length > 0) {
            const recentInputTransactions = walletInputTransactions.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            )
            balance = recentInputTransactions.output.find(output => output.address === this.publicKey).amount
            startTime = recentInputTransactions.input.timestamp
        }

        transactions.forEach(transaction => {
            if(transaction.input.timestamp > startTime) {
                transaction.output.find(output => {
                    if(output.address === this.publicKey) {
                        balance += output.amount
                    }
                })
            }
        })

        return balance
    }

    static blockchainWallet() {
        const blockchainWallet = new this()
        blockchainWallet.address = 'sev-blockchain-wallet'
        return blockchainWallet
    }

}
module.exports = Wallet