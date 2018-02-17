// Temporary: Get API key from the first command line argument
const apiKey = process.argv[2];

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));

web3.eth.subscribe('pendingTransactions', console.log);
