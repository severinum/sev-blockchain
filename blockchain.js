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

}

module.exports = Blockchain