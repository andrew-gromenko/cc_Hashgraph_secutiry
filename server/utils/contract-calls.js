const path = require('path')
const fs = require('fs')
const Web3 = require('web3')
const web3 = new Web3(`http://${process.env.GETH_URL}:8545`)

const Accounts = require('web3-eth-accounts')

const accounts = new Accounts(`ws://${process.env.GETH_URL}:8546`)

const main = async () => {
  let address = null
  let abi = null
  while (!address) {
    try {
      abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/abi/src_Permission-managment_sol_RBAC.abi')))
      address = fs.readFileSync(path.join(__dirname, '../data/.addressrc'), 'utf8')
    } catch (e) {
      // console.log('waiting for .address file')
    }
  }
  console.log('CONTRACT ADDRESS: ', address)
  const [account] = await web3.eth.getAccounts()
  console.log(account)
  const myContract = new web3.eth.Contract(abi, address, {
    from: account,
    gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
    gas: 2000000
  })
  // myContract.methods.owner().call().then(console.log).catch(console.error)
  // console.log('CALL', myContract.methods.owner().call())
  // console.log(myContract, abi)
  const addPermission = (addr, str) => myContract.methods.adminAddPermission(addr, web3.utils.utf8ToHex(str)).send()
  const removePermission = (addr, str) => myContract.methods.adminRemovePermission(addr, web3.utils.utf8ToHex(str)).send()
  const hasPermission = (addr, str) => myContract.methods.hasPermission(addr, web3.utils.utf8ToHex(str)).call()
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
//   console.log('TEST USER ADDRESS: ', newUserAcc)
//   const g = await getAdmin()
//   console.log('ADMIN: ', g)
//   const a = await addPermission(newUserAcc.address, 'file2.txt')
//   console.log('SHOULD BE TX INFO(added permission method worked AND CHANGED THE STATE):\n', a)
//   const b = await hasPermission(newUserAcc.address, 'file2.txt')
//   console.log('SHOULD BE TRUE(check for permission user have):', b)
//   const c = await hasPermission(newUserAcc.address, 'file.txt')
//   console.log('SHOULD BE FALSE(check for permission user doesn\'t have):', c)
// })
