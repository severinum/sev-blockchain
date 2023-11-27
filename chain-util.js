const EC = require('elliptic').ec
const {v4: uuidv4} = require('uuid')

const ec = new EC('secp256k1')

class ChainUtils {
    
    static genKeyPair () {
        return ec.genKeyPair();
    }

    static id() {
        return uuidv4()
    }

}

module.exports = ChainUtils