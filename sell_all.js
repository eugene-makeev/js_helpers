/**
 * 
 */
import "key.js"
var bittrex = require('./node.bittrex.api/node.bittrex.api.js');

bittrex.options({
  'apikey' : API_KEY,
  'apisecret' : API_SECRET,
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

    	  available = data.result.filter(balance => balance.Available > 0);
          console.log("\n\n\nCurrencies available:", available.length ,"\n", available);
          available.forEach(function(element) {
        	  if (element.Currency === 'BTC') {
        		  markets.push('USDT-BTC');
        	  }
        	  else if (element.Currency != 'USDT') {
        		  markets.push('BTC-' + element.Currency);
        	  }
     	  });
          //markets = Array.from({length : available.length}, (e, i) => 'BTC-' + available[i].Currency);
          console.log(markets);
          
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