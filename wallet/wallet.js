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
            console.log('Recreating wallet from stored keys')
            this.keyPair = ChainUtils.createKeyPairFromStringKeys(publicKeyString, privateKeyString)
            // TODO: if wallet exists , set the wallet balance by scanning all blockchain transactions

        }
        this.publicKey = this.keyPair.getPublic().encode('hex'); // get the public kye but as hex   
    }

    setBalance(newBalance) {
        this.balance = newBalance
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

    createTransaction(recipient, amount, blockchain, transactionPool, sender = null) {
     
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
        
        if(sender !== null) {
            const senderWalletBalance = Wallet.getBalance(blockchain, sender.publicKey)
            if(amount > senderWalletBalance) {
                console.log(`Amount: ${amount} is too high for current wallet balance: ${senderWalletBalance}`)
                return
            }

            let transaction = transactionPool.existingTransaction(sender.publicKey)
            if (transaction) {
                transaction.update(sender, recipient, amount)
            } else {
                transaction = Transaction.newTransaction(sender, recipient, amount)
                transactionPool.updateOrAddTransaction(transaction)
            }
        }
 
        return transaction
    }

    // Calculate balance for the Node wallet only
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
            if (transaction.input.timestamp > startTime) {
                transaction.output.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount
                    }
                })
            }
        })

        return balance
    }

    // Get balance for any walleta address
    static getBalance(blockchain, walletAddress) {
        console.log('Getting balance ...')
        let balance = 0

        let transactions = []
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction)
        }))

        console.log(transactions);

        const walletInputTransactions =
            transactions.filter(transaction => transaction.input.address === walletAddress)

        let startTime = 0

        if (walletInputTransactions.length > 0) {
            const recentInputTransactions = walletInputTransactions.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            )
            balance = recentInputTransactions.output.find(output => output.address === walletAddress).amount
            startTime = recentInputTransactions.input.timestamp

            transactions.forEach(transaction => {
                if (transaction.input.timestamp > startTime) {
                    transaction.output.find(output => {
                        if (output.address === this.publicKey) {
                            balance += output.amount
                        }
                    })
                }
            })

        } else {
            console.log(`Don't have any input transactions from wallet`);
            transactions.forEach(transaction => {

                transaction.output.find(output => {
                    if (output.address === walletAddress) {
                        balance += output.amount
                    }
                })

            })
        }

        return balance
    }

    static blockchainWallet() {
        const blockchainWallet = new this()
        //blockchainWallet.address = 'sev-blockchain-wallet'
        return blockchainWallet
    }

}
module.exports = Wallet