const Transaction = require("../wallet/transaction")
const Wallet = require("../wallet/wallet")
const { MIN_NUM_TRANSACTIONS_TO_MINE } = require('../config')
const ResponseMessage = require('./ResponseMessage')

class Miner {

    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.p2pServer = p2pServer
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions()
        if(validTransactions.length == 0) {
           let errorMsg = `Won't mine. Zero transactions in pool`
           console.log(errorMsg)
            return new ResponseMessage(errorMsg);
        }
        if(validTransactions.length < MIN_NUM_TRANSACTIONS_TO_MINE) {
            // Mine block if pool age reach minimum treshlod 
            let mins = Date.now() - this.transactionPool.poolCreationTime
            if(mins >= 2000) {
                console.log(`Mine with low num transaction in block: ${validTransactions.length} transaction(s)`)
            } else {
                const errorMsg = `Won't mine block. Not enough transactions in block, (min ${MIN_NUM_TRANSACTIONS_TO_MINE}, current ${validTransactions.length})`
                console.log(errorMsg)
                return new ResponseMessage(errorMsg);
            }  
        }
        
        // include reward for the miner
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))

        // create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTransactions);

        // sync. the chains in the p2p server
        this.p2pServer.syncChains()

        // clear the transaction pool
        this.transactionPool.clear()

        // broadcast to every mniner to clear their transaction pools
        this.p2pServer.broadcastClearPoolTransactions()

        this.transactionPool.poolCreationTime = Date.now()

        return new ResponseMessage(`Block mined.`, 200, block)
    }

}
module.exports = Miner