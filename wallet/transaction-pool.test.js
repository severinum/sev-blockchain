const TractionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./wallet')


describe('Transaction Pool', () => {
    let tp, wallet, transaction;
    
    beforeEach(() => {
        tp = new TractionPool()
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, '1deaef34ad76a', 30)
        tp.updateOrAddTransaction(transaction)
    })

    it('validates if transaction was added to the pool', () => {
        expect(tp.transactions.find( t => t.id === transaction.id))
            .toEqual(transaction)
    })

    it('validates if transaction was updated in the pool', () => {
        let oldTransaction = JSON.stringify(transaction)
        const newTransaction = transaction.update(wallet, 'nEw12tRansaCt1on2', 40)
        tp.updateOrAddTransaction(newTransaction)

        expect(JSON.stringify(tp.transactions.find( t => t.id === newTransaction.id)))
          .not.toEqual(oldTransaction)
    })
})