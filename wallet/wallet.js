const { INITIAl_BALANCE } = require('../config')
const ChainUtils = require('../chain-util')

class Wallet {
    
    constructor() {
        this.balance = INITIAl_BALANCE
        this.keyPair = ChainUtils.genKeyPair(); // genetate pair of keys
        this.publicKey = this.keyPair.getPublic().encode('hex'); // get the public kye but as hex
    }
    
    toString() {
        return `Wallet - 
            publicKey      : ${this.publicKey.toString()}
            balance        : ${this.balance}`
    }

}
module.exports = Wallet