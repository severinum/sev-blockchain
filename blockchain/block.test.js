const Block = require('./block');
const { DIFICULTY } = require('../config')

describe ('Block', () => {

    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar'
        lastBlock = Block.genesis()
        block = Block.mineBlock(lastBlock, data)
    })

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data)
    })

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash)
    })

    it('generates the hash that mtach the dificulty', () => {
        expect(block.hash.substring(0, DIFICULTY)).toEqual('0'.repeat(DIFICULTY))
    })

});