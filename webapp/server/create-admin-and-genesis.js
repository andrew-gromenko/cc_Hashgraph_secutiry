const fs = require('fs')
const Accounts = require('web3-eth-accounts')
const genesisExample = require('./genesis.json')

const accounts = new Accounts(`ws://${process.env.GETH_URL}:8546`)
const admin = accounts.create()

fs.writeFileSync('../geth_node/.adminrc', admin.privateKey.slice(2))
console.log(admin.address)
const alloc = { [admin.address]: { balance: '2000000000' } }
const newGenesis = { ...genesisExample, alloc }
fs.writeFileSync('../geth_node/files/genesis.json', JSON.stringify(newGenesis))
