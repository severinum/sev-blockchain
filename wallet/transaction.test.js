const Transaction = require('./transaction')
const Wallet = require('./wallet')

describe ('Transaction', () => {

    let transaction, wallet, recipient, amount
    
    beforeEach(() => {
        wallet = new Wallet()
        amount = 10
        recipient = '0xRecipient1'
        transaction = Transaction.newTransaction(wallet, recipient, amount)
    })

    it('outputs the `amount` from the wallet balance', () => {
        expect(transaction.output.find( otpt => otpt.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount)
    })

    it('outputs the `amount` added to the recipient balance', () => {
        expect(transaction.output.find( otpt => otpt.address === recipient).amount)
            .toEqual(amount)
    })

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance)
    })

    it('validates the valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })

    it('validates an invalid transaction', () => {
        transaction.output[0].amount = 150000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    })


    describe('transaction with amount higher than wallet balance', () => {
        
        beforeEach(() => {
            amount = 50000
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        })

        it('doesnt creates transaction when `amount` higher than `balance`', () => {
            expect(transaction).toEqual(undefined)
        })
    })
})