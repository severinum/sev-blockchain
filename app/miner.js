class Miner {

    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.p2pServer = p2pServer
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions()

        // include reward for the miner

        // create a block consisting of the valid transactions

        // sync. the chains in the p2p server

        // clear the transaction pool

        // broadcast to every mniner to clear their transaction pools
    }

}
module.exports = Miner