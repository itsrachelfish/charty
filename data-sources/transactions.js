// File for getting transaction data from recent blocks

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));

console.log("Listening for new blocks...");

// Listen for new blocks
web3.eth.subscribe('newBlockHeaders', processBlock);

function processBlock(error, block, subscription)
{
    console.log(block);

    if(!error)
    {
        web3.eth.getBlock(block.number).then(console.log);
    }
}
