const Block = require('./block');

class Blockchain {

    constructor() {
        this.chain = [Block.genesis()] // init chain with Genesis Block as 1st block
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data)
        this.chain.push(block) // add new block to chain
        
        return block
    }

    isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            console.log('invalid genesis block in isValidChain')
            return false
        }

        for (let i=1; i<chain.length; i++) {
            const block = chain[i]
            const lastBlock = chain[i-1]

            if(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block) ){
                return false
            }
        }
        return true
    }

    replaceChain(newChain) {
        console.log(`Started chain replacement process at: ${Date.now()}`)
        // check if new chain is longer (longer is a valid chain [our consesus])
        if(newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain [consenus matter]')
            console.log(`Finished chain replacement process at: ${Date.now()}`)
            return
        } else if (!this.isValidChain(newChain)) {
            console.log('Received chain is not valid')
            console.log(`Finished chain replacement process at: ${Date.now()}`)
            return
        }

        // Original chain last block hash must be equal to new candidate chain length-1 block hash
        if(newChain[newChain.length - 2].hash != this.chain[this.chain.length -1].hash) {
            console.log('FAIL!!!: Block is invalid. Last block hash in chain is not equal to new chain block hash')
            // TODO: In case if new blockchain node is created/joned , its chain has length is 1 (genesis block only)
            // or node was inactive (connection issue). Then its chain length may be different. 
            console.log('New node or inactive node rejoining chain')
            return
        } else {
            console.log('OK. Chains hashes are correct')
        }

        // Original chain last block blockNumberInChain must be equal to new candidate chain length-1 block blockNumberInChain
        if(newChain[newChain.length - 2].blockNumberInChain != this.chain[this.chain.length -1].blockNumberInChain) {
            console.log('FAIL!!! : Block is invalid. Last block number in chain is not equal to new chain block number')
            return
        } else {
            console.log('OK. Chains block numbers are correct')
        }
        
        // Find place where blocks have same length
        // Attach missing blocks 
        const differenceInChainLengths = newChain.length - this.chain.length
        console.log(`Replacing chain strats at: ${Date.now()}`)
        this.chain.push(newChain[this.chain.length]) // updating chain
        console.log(`Finished chain replacement process at: ${Date.now()}`)
    }

    static findTransaction(blockchain, transactionId) {
        console.log(`Searching for transaction with id: ${transactionId} `)
        const blockchainLength  = blockchain.chain.length
        // TODO: find efficient way to find transactions
        // Blockchain will be too long to do the regualr search
        // maybe use db ???
        let foundTransaction = null
        
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            if(transaction.id === transactionId) {
                foundTransaction = transaction
                foundTransaction.blockHash = block.hash
                foundTransaction.blocktimestamp = block.timestamp
                foundTransaction.blockNumberInChain = block.blockNumberInChain
            }        
        }))
        return foundTransaction
    }

    static getTransactionConfirmations(blockchain, transactionId) {
        const findTransaction = Blockchain.findTransaction(blockchain, transactionId)
        if(!findTransaction) {
            return 0;
        }
        const foundTransactionBlockNumber = findTransaction.blockNumberInChain
        const latestBlockNumber = blockchain.chain[blockchain.chain.length - 1].blockNumberInChain

        return latestBlockNumber - foundTransactionBlockNumber
    }

}

module.exports = Blockchain