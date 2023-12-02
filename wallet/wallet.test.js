const Wallet = require('./wallet')
const Transaction = require('./transaction')
const TransactionPool = require('./transaction-pool')


describe('Wallet', () => {

    let wallet, tp;

    beforeEach(() => {
        wallet = new Wallet('04c3b6b1dffcfb43f84aea3efae5b2fb55aa8fd63e60ee6a8ae82c04db7259c339f6735efe5b764b9b06dcd76b219a9efcfacf5d3e3f9af37309d30611cc8b5001', '"e4d3ef983a3ec2090572b87c916f83dde22c332db8c66cd46ef9f4008e31cf1d"')
        tp = new TransactionPool()
    })

    describe('creating transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 20;
            recipient = 'rEc1piEnt-aDDress'
            transaction = wallet.createTransaction(recipient, sendAmount, tp)
        })

        describe('attempting the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp)
            })

            it('double the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.output.find( output => output.address === wallet.publicKey).amount)
                  .toEqual(wallet.balance - sendAmount * 2)
            })

            it('clones the `sendAmount` output for the recpient', () => {
                expect(transaction.output.filter(output => output.address === recipient)
                    .map(output => output.amount)).toEqual([sendAmount, sendAmount])
            })
        })
        

    })

})