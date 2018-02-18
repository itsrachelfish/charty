const store = require('./store.js');

const marketData = require('./gdax_logger.js')(store);
const memPool    = require('./mempool.js')(store);
