var search = require('./searchAlgo');

var bdbApi = {
    'parseResp': function(beer, response) {
        var data = JSON.parse(response).data;

        if (data === undefined) {
            return {'searchedBeer': beer}
        }

        // Return a JSON response of datum at bestMatchI index
        return search.searchAlgo(beer, data);
    }
}

module.exports = bdbApi;
