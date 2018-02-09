const path = require('path')
const fs = require('fs')

const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../smart-contracts/abi/src_Permission-managment_sol_RBAC.abi')))
const data = fs.readFileSync(path.resolve(__dirname, '../smart-contracts/bin/src_Permission-managment_sol_RBAC.bin'))
console.log(abi, data)

const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')

const main = async () => {
  const [account] = await web3.eth.getAccounts()
  var myContract = new web3.eth.Contract(abi, {
    from: account,
    gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
    gas: 2000000 // gasLimit
  })

  myContract.deploy({
    data: '0x' + data,
    arguments: [account]
  })
  .send({
    from: account,
    gas: 2000000,
    gasPrice: '20000000000'
  })
  .then(newContractInstance => {
    fs.writeFileSync(path.resolve(__dirname, '.addressrc'), newContractInstance.options.address)
  })
}

main()
.catch(console.log)
