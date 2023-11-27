const SHA256 = require ('crypto-js/sha256')
const DIFICULTY = 4;


class Block {
    
    constructor(timestamp, lastHash, hash, data, nonce) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce;
    }

    static genesis() {
        return new this('Big Bang', 
        '------', 
        '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9', 
        [],
        0)
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash
        
        // Proof of Work part
        let nonce = 0
        do {
            nonce++ // noce is changing to generate new hash with DIFICILTY number of leading Zeros
            timestamp = Date.now()
            hash = Block.hash(timestamp, lastHash, data, nonce)
        } while(hash.substring(0, DIFICULTY) !== '0'.repeat(DIFICULTY)) // loop untill hash has DIFICILTY num. of leading '0' in hash
        
    
        return new this(timestamp, lastHash, hash, data, nonce)
    }

    static hash(timestamp, lastHash, data, nonce) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString()
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce } = block;
        return Block.hash(timestamp, lastHash, data, nonce)
    }

    toString() {
        return `Block - 
            Timestamp   : ${this.timestamp}
            Last Hash   : ${this.lastHash.substring(0, 20)}
            Hash        : ${this.hash.substring(0, 20)} 
            Nonce       : ${this.nonce} 
            Data:       : ${this.data}
        `
    }
}

module.exports = Block;