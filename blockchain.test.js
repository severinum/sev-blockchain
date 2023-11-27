const Blockchain = require('./blockchain');
const Block = require('./block')

describe ('Blockchain', () => {

    let blockchain, blockchain2;

    beforeEach(() => {
        blockchain = new Blockchain()
        blockchain2 = new Blockchain()
    })

    it('start with the genesis block as 1st block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    });

    it('adds new block', () => {
        const data = 'cats are awesome!'
        blockchain.addBlock(data)

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data)
    });

    it('validates a valid chain', () => {
        blockchain2.addBlock('cats are awesome!')
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(true)
    });

    it('invalidates a chain with a corrupt genesis block', () => {
        blockchain2.chain[0] = 'Bad Genesis Block'
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false)
    });

    it('validates a corrupt chain', () => {
        blockchain2.addBlock('cats are awesome!')
        blockchain2.chain[1].data = 'cats are not cool!'
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false)
    });
});