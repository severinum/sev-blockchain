const EC = require('elliptic').ec

const ec = new EC('secp256k1')

class ChainUtils {
    static genKeyPair () {
        return ec.genKeyPair();
    }
}

module.exports = ChainUtils