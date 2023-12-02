class TractionPool {
    
    constructor() {
        this.transactions = []
    }

    updateOrAddTransaction(transaction) {
        // Transaction may exisst in transactions table, so it need an update as transaction can have multiple outputs
        let findExistingTransaction = this.transactions.find(trans => trans.id === transaction.id)
        if(findExistingTransaction)  {
            this.transactions[this.transactions.indexOf(findExistingTransaction)] = transaction
        } else {
            this.transactions.push(transaction)
        }
    }

    existingTransaction(walletAddress) {
        return this.transactions.find(t => t.input.address === walletAddress)
    }
}
module.exports = TractionPool