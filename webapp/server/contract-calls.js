const path = require('path')
const fs = require('fs')
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../smart-contracts/abi/src_Permission-managment_sol_RBAC.abi')))
const Web3 = require('web3')
const web3 = new Web3('http://geth:8545')

const Accounts = require('web3-eth-accounts')

const accounts = new Accounts('ws://geth:8546')

const main = async () => {
  const address = fs.readFileSync(path.join(__dirname, '.addressrc'), 'utf8')
  const [account] = await web3.eth.getAccounts()
  console.log(account)
  const myContract = new web3.eth.Contract(abi, address, {
    from: account,
    gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
    gas: 2000000
  })
  const addPermission = (addr, str) => myContract.methods.adminAddPermission(addr, web3.utils.utf8ToHex(str)).send()
  const removePermission = (...args) => myContract.methods.adminRemovePermission(...args).send()
  const hasPermission = (...args) => myContract.methods.hasPermission(...args).call()
  const getAdmin = () => myContract.methods.owner().call()
  const getPermissions = (...args) => myContract.methods.permissions(...args).call()
  const createNewUser = () => {
    const acc = accounts.create()
    web3.eth.accounts.wallet.add(acc)
    // web3.eth.accounts.wallet.save('test') // persist somehow
    return acc
  }

  return {
    addPermission,
    removePermission,
    hasPermission,
    getAdmin,
    getPermissions,
    createNewUser
  }
}

module.exports = main()
.catch(console.error)
// .then(async ({ addPermission, hasPermission, getAdmin, getPermissions }) => {
//   const newUserAcc = web3.eth.accounts.create()
//   console.log(newUserAcc)
//   const a = await addPermission(newUserAcc.address, web3.utils.utf8ToHex('file2.txt'))
//   const g = await getAdmin()
//   const b = await hasPermission(newUserAcc.address, web3.utils.utf8ToHex('file2.txt'))
//   const c = await hasPermission(newUserAcc.address, web3.utils.utf8ToHex('file.txt'))
//   console.log(a, b, c, g)
// })
