const Blockchain = require('./blockchain');
const Block = require('./block')

describe ('Blockchain', () => {

    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain()
    })

    it('start with the genesis block as 1st block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    });

    it('adds new block', () => {
        const data = 'new block'
        blockchain.addBlock(data)

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data)
    });
    
});