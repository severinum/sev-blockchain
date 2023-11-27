const express = require('express')
const Blockchain = require('../blockchain/blockchain')
const P2PServer = require ('./p2p-server')
const bodyParser = require('body-parser')

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
app.use(bodyParser.json())

const blockchain = new Blockchain()
const p2pServer = new P2PServer(blockchain);

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data)
    console.log(`New block added ${block.toString()}`)

    p2pServer.syncChains();

    res.redirect('/blocks')
})

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}`))
p2pServer.listen(); // start web socket server