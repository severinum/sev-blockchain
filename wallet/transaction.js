const ChainUtils = require('../chain-util')
const { MINING_REWAR } = require('../config')

class Transaction {

    constructor(){
        this.id = ChainUtils.id()
        this.input = null
        this.output = []
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.output.find(output => output.address === senderWallet.publicKey)

        // Check case if sender want to send some amount in short time after previous transaction
        // and may not have enough balance (preventing double spend problem)
        if(amount > senderOutput.amount) {
            console.log(`Amout: ${amount} is higher than balance!`)
            return;
        }

        senderOutput.amount = senderOutput.amount - amount
        this.output.push({amount, address: recipient})
        // Need to sign transaction again if new item was added to outputs
        Transaction.signTransaction(this, senderWallet)

        return this
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