const ChainUtils = require('../chain-util')

class Transaction {

    constructor(){
        this.id = ChainUtils.id()
        this.input = null
        this.output = []
    }

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this()
        if(amount > senderWallet.balance) {
            console.log(`Amount: ${amount} bigger than a wallet balance!`)
            return
        }

        transaction.output.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient}
        ])

        Transaction.signTransaction(transaction, senderWallet)

        return transaction
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtils.hash(transaction.output))
        }
    }

    static verifyTransaction(transaction) {
        return ChainUtils.verifySignature(
            transaction.input.address, 
            transaction.input.signature,
            ChainUtils.hash(transaction.output)
        )
    }
}

module.exports = Transaction