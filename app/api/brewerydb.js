var search = require('./searchAlgos');

var bdbApi = {
    'parseResp': function(beer, response) {
        var data = JSON.parse(response).data;

        if (data === undefined) {
            return {'searchedBeer': beer}
        }

        var potentialMatches = [];
        data.forEach(function(elem, idx) {
            potentialMatches[idx] = elem.name || 'N/A';
        });

        var bestMatchIndex = search.searchBeer(beer, potentialMatches);
        // Return a JSON response of datum at bestMatchI index
        return data[bestMatchIndex];
    }
}

module.exports = bdbApi;
