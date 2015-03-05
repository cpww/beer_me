var search  = require('./searchAlgo');
var secrets = require(__base + 'secrets');
var request = require('request');

/*
    Todo:

    Beer search to get BID
    data.response.beers.items[0].beer.bid for first

    ***Modularize search similar to brewerydb***

    Use Beer info to get venue with the BID
    Search for closest long-lat according to user location
*/

var utdApi = {
	'parseResp':
		function(beer, response) {
            var data = JSON.parse(response);
            var potentialMatches = [];

            // Loop to create an array of names
            // compared in the search algo to best
            // match the beer name
            data.response.beers.items.forEach(function(elem, idx) {
                potentialMatches[idx] = elem.beer.beer_name || 'N/A';
            });

            var matchedBeerIndex = search.searchAlgo(beer, potentialMatches);
            var matchedBeerId = data.response.beers.items[matchedBeerIndex].beer.bid;

            // New call for venue_info using matchedBeerId
            // /v4/beer/info/BID
            var untappdInfoEndpoint = 'https://api.untappd.com/v4/beer/info/' + matchedBeerId + '?client_id=' + secrets.utdIdKey + '&client_secret=' + secrets.utdSecretKey;
            return 'Not done!';
            // WIP
            request(untappdInfoEndpoint, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var bidData = JSON.parse(body);
                // JSON.parse(body).response.beer.checkins.items[0].venue.location
                // debugger;
                // Get the long/lat of the venue
              } else if (error) {
                console.log(error);
                return 'Error with Untappd BID endpoint';
              }
            });

            return data.response.beers.items[matchedBeerIndex];
		}
}

module.exports = utdApi;
