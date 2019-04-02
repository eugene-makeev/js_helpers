/**
 * 
 */

const keys = require('./key.js');
var bittrex = require('node-bittrex-api/node.bittrex.api.js');

bittrex.options({
  'apikey' : keys.API_KEY,
  'apisecret' : keys.API_SECRET,
  'verbose' : true,
  'cleartext' : false,
  'baseUrl' : 'https://bittrex.com/api/v1.1',
  'baseUrlv2' : 'https://bittrex.com/Api/v2.0'
});

bittrex.options({
  websockets: {
    onConnect: function() {
      console.log('Websocket connected');
      var available = []
      var markets = []
      
      bittrex.getbalances(function(data, err) {
    	  if (err) {
    	    return console.error(err);
    	  }

    	  available = data.result.filter(balance => balance.Balance > 0);
          console.log("\n\n\nCurrencies available:", available.length);
          available.forEach(function(element) {
			  console.log("\t", element.Currency, ":", element.Balance);
        	  if (element.Currency === 'BTC') {
        		  markets.push('USDT-BTC');
        	  }
        	  else if (element.Currency != 'USDT') {
        		  markets.push('BTC-' + element.Currency);
        	  }
     	  });
          
          bittrex.websockets.subscribe(markets, function(data) {
            if (data.M === 'updateExchangeState') {
              data.A.forEach(function(data_for) {
                console.log('Market Update for '+ data_for.MarketName, data_for);
              });
            }
          });
    	});
    },
    onDisconnect: function() {
      console.log('Websocket disconnected');
    }
  }
});
 
var websocketClient;
bittrex.websockets.client(function(client) {
  websocketClient = client;
});