var search  = require('./searchAlgos');
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
		function(beer, response, userCoords) {
            if (location) {
                var data = JSON.parse(response);
                var potentialMatches = [];

                // Loop to create an array of names
                // compared in the search algo to best
                // match the beer name
                data.response.beers.items.forEach(function(elem, idx) {
                    potentialMatches[idx] = elem.beer.beer_name || 'N/A';
                });

                var matchedBeerIndex = search.searchBeer(beer, potentialMatches);
                var matchedBeerId = data.response.beers.items[matchedBeerIndex].beer.bid;

                // New call for venue_info using matchedBeerId
                // /v4/beer/info/BID
                var untappdInfoEndpoint = 'https://api.untappd.com/v4/beer/info/' + matchedBeerId + '?client_id=' + secrets.utdIdKey + '&client_secret=' + secrets.utdSecretKey;
                var coordsReceived = [];
                var venuName = '';
                var bidData = {};
                request(untappdInfoEndpoint, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                    bidData = JSON.parse(body);
                    bidData.response.beer.checkins.items.forEach(function(elem, idx) {
                        // Make an array of the long/lats
                        coordsReceived.push([elem.venue.location.lat, .venue.location.lng])
                    });
                  } else if (error) {
                    return 'Error with Untappd BID endpoint';
                  }
                });

                // returns object of lat/lng closest to
                // user location
                closestVenueCoords = search.searchLocation(userCoords, coordsReceived);
                return bidData.response.beer.checkins.items[closestVenueCoords.index];;

            } else {
                // if no location given
                return 'User did not give location'
            }
		}
}

module.exports = utdApi;
