### Instructions
1. docker-compose up
2. docker exec -it gethnode_geth_1 geth attach ipc:/tmp/geth.ipc

### Deploy contract
var Contractaddress = "0x326dA25E371BabC543E9D026Ca3d17ABf158D260";
var permissionsContract = web3.eth.contract([]);
var permissions = permissionsContract.new(web3.eth.accounts[0],
   {
     from: web3.eth.accounts[0], 
     data:'0x60606040523415600e57600080fd5b603580601b6000396000f3006060604052600080fd00a165627a7a7230582032fa27c80b0bc4431912c63c1e198dd25005442c1526c69d096c739dc1dd18230029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         Contractaddress = contract.address;
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
});
var abi = [{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"permissionName","type":"string"}],"name":"adminRemovePermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"permissionName","type":"string"}],"name":"adminAddPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"},{"name":"permissionName","type":"string"}],"name":"hasPermission","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"PermissionName","type":"string"}],"name":"PermissionAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"PermissionName","type":"string"}],"name":"PermissionRemoved","type":"event"}]
var contractAbi = eth.contract(abi);
var myContract = contractAbi.at(Contractaddress);
// suppose you want to call a function named myFunction of myContract
var getData = myContract.adminAddPermission.getData(web3.eth.accounts[0]);
//finally paas this data parameter to send Transaction
web3.eth.sendTransaction({to:Contractaddress, from:web3.eth.accounts[0], data: getData});