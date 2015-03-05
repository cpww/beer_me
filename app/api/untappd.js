/*
    Todo:

    Beer search to get BID
    data.response.beers.items[0].beer.bid for first

    Modularize search similar to brewerydb

    Use Beer info to get venue with the BID
    Search for closest long-lat according to user location
*/



var utdApi = {
	'parseResp':
		function(beer, response) {
            var data = JSON.parse(response);
            // debugger;
            // Todo
            return data;
		}
}

module.exports = utdApi;
