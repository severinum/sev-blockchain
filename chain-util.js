const EC = require('elliptic').ec
const {v4: uuidv4} = require('uuid')
const SHA256 = require ('crypto-js/sha256')

const ec = new EC('secp256k1')

class ChainUtils {
    
    static genKeyPair () {
        return ec.genKeyPair();
    }

    static id() {
        return uuidv4()
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString()
    }

    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)
    }

}

module.exports = ChainUtils