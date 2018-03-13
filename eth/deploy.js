const path = require('path')
const fs = require('fs')

const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/abi/src_Permission-managment_sol_RBAC.abi')))
const data = fs.readFileSync(path.resolve(__dirname, 'data/bin/src_Permission-managment_sol_RBAC.bin'))

const Web3 = require('web3')
const web3 = new Web3(`http://${process.env.GETH_URL}:8545`)

const waitPort = require('wait-port')

const params = {
  host: process.env.GETH_URL,
  port: 8545
}

waitPort(params)
  .then(async open => {
    const [account] = await web3.eth.getAccounts()
    const myContract = new web3.eth.Contract(abi, {
      from: account,
      gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
      gas: 2000000 // gasLimit
    })

    return myContract.deploy({
      data: '0x' + data,
      arguments: [account]
    })
      .send({
        from: account,
        gas: 2000000,
        gasPrice: '20000000000'
      })
      .then(newContractInstance => {
        console.log('ADRESS DEP', newContractInstance.options.address)
        fs.writeFileSync(path.resolve(__dirname, 'data', '.addressrc'), newContractInstance.options.address)
      })
  })
