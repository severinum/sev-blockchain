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
        // check if new chain is longer (longer is a valid chain [our consesus])
        if(newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain [consenus matter]')
            return
        } else if (!this.isValidChain(newChain)) {
            console.log('Received chain is not valid')
            return
        }
        
        console.log('Replacing blockchain with the new chain!')
        this.chain = newChain;
    }

}

module.exports = Blockchain