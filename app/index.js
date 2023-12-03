const express = require('express')
const Blockchain = require('../blockchain/blockchain')
const P2PServer = require ('./p2p-server')
const bodyParser = require('body-parser')

const Wallet = require('../wallet/wallet')
const TractionPool = require('../wallet/transaction-pool')
const Miner = require('./miner')
const ResponseMessage = require('./ResponseMessage')
const Block = require('../blockchain/block')

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
app.use(bodyParser.json())

const blockchain = new Blockchain()
const wallet = new Wallet()
const tp = new TractionPool()
const p2pServer = new P2PServer(blockchain, tp);
const miner = new Miner(blockchain, tp, wallet, p2pServer)

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data)
    console.log(`New block added ${block.toString()}`)

    p2pServer.syncChains();

    res.redirect('/blocks')
})


app.get('/transaction', (req, res) => {
    res.json(tp.transactions)
})

app.post('/transaction', (req, res) => {
    const { recipient, amount } = req.body
    const transaction = wallet.createTransaction(recipient, amount, tp)
    p2pServer.broadcastTransaction(transaction)
    res.redirect('/transaction')
})

app.get('/transaction/find/:transactionId', (req, res) => {
    const transactionId = req.params.transactionId
    const foundTransaction = Blockchain.findTransaction(blockchain, transactionId)

    res.status(200).send(foundTransaction)
}) 


app.get('/public-key', (req, res) => {
    res.json({publicKey: wallet.publicKey})
})

// Mine transactions pool valid transactions to blockchain an earns reward
app.post('/mine-transactions', (req, res) => {
    const response = miner.mine();
    
    res.status(response.code).send(response)
})

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}`))
p2pServer.listen(); // start web socket server