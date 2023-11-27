const SHA256 = require ('crypto-js/sha256')

class Block {
    
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
    }

    static genesis() {
        return new this('Genesis time', '------', '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9', [])
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now()
        const lastHash = lastBlock.hash
        const hash = Block.hash(timestamp, lastHash, data)

        return new this(timestamp, lastHash, hash, data)
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString()
    }

    static blockHash(block) {
        const { timestamp, lastHash, data } = block;
        return Block.hash(timestamp, lastHash, data)
    }


    toString() {
        return `Block - 
            Timestamp   : ${this.timestamp}
            Last Hash   : ${this.lastHash.substring(0, 20)}
            Hash        : ${this.hash.substring(0, 20)}  
            Data:       : ${this.data}
        `
    }
}

module.exports = Block;