// File for getting data from the mempool
const request = require('superagent');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

request.get('https://ethgasstation.info/txPoolReport.php').end((error, response) =>
{
    const dom = new JSDOM(response.text);
    console.log("Block #" + dom.window.document.querySelector('.x_title span').textContent);
});
