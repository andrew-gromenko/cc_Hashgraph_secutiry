const path = require('path')
const fs = require('fs')
const abi = require('./smart-contracts/RBAC_sol_RBAC.abi.json')
const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')

const main = async () => {
  const address = fs.readFileSync(path.join(__dirname, '.addressrc'), 'utf8')
  console.log(address)
  const [account] = await web3.eth.getAccounts()
  const myContract = new web3.eth.Contract(abi, address, {
    from: account,
    gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
    gas: 2000000
  })
  console.log(myContract)
  const addPermission = (...args) => myContract.methods.adminAddPermission(...args).send()
  const removePermission = (...args) => myContract.methods.adminRemovePermission(...args).send()
  const hasPermission = (...args) => myContract.methods.hasPermission(...args).call()
  const getAdmin = () => myContract.methods.owner().call()

  return {
    addPermission,
    removePermission,
    hasPermission,
    getAdmin
  }
}

module.exports = main()
.catch(console.error)
.then(async ({ addPermission, hasPermission, getAdmin }) => {
  const newUserAcc = web3.eth.accounts.create()
  // console.log(newUserAcc)
  const a = await addPermission(newUserAcc.address, 'file1.txt')
  .on('transactionHash', (hash) => {
    console.log('transactionHash')
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log('confirmation', confirmationNumber, receipt)
  })
  .on('receipt', (receipt) => {
    console.log('receipt', receipt)
  })
  .on('error', err => { throw new Error('ERRRRRRRROOOOOORRRRRR' + err) })
  // const b = await hasPermission(newUserAcc.address, 'file2.txt')
  // const o = await getAdmin()
  // console.log(a)
})
