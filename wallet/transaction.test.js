const Transaction = require('./transaction')
const Wallet = require('./wallet')

describe ('Transaction', () => {

    let transactions, wallet, recipient, amount
    
    beforeEach(() => {
        wallet = new Wallet()
        amount = 10
        recipient = '0xRecipient1'
        transactions = Transaction.newTransaction(wallet, recipient, amount)
    })

    it('outputs the `amount` from the wallet balance', () => {
        expect(transactions.output.find( otpt => otpt.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount)
    })

    it('outputs the `amount` added to the recipient balance', () => {
        expect(transactions.output.find( otpt => otpt.address === recipient).amount)
            .toEqual(amount)
    })

    describe('transactions with amount higher than wallet balance', () => {
        
        beforeEach(() => {
            amount = 50000
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        })

        it('doesnt creates transaction when `amount` higher than `balance`', () => {
            expect(transaction).toEqual(undefined)
        })
    })
})