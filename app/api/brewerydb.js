var bdbApi = {
    'parseResp': function(beer, response) {
        var data = JSON.parse(response).data;

        if (data === undefined) {
            return {'searchedBeer': beer}
        }

        // Create an array that filters the return data such that the last
        // entry in the array will be the data entry that had the most words
        // that matched the original queried beer
        var matchWords = beer.split(' ');
        var matches = 0;
        var bestMatchI = 0;
        for (i = 0; i < data.length; i++) {

            // Determine the number of words in the current datum that match
            // words in the original beer search
            var curMatches = data[i].name.split(' ').filter( function(word) {
                return matchWords.indexOf(word) > -1;
            }).length;

            if (curMatches == matchWords.length) {
                // All the words in the datum match all the words
                // in the original beer request, go with it!
                bestMatchI = i;
                break;
            }
            else if (curMatches > matches) {
                // Let's hold onto this index, it may turn out
                // to be the best match! Also, update matches.
                bestMatchI = i;
                matches = curMatches;
            }
        }

        // Return a JSON response of datum at bestMatchI index
        return data[bestMatchI];
    }
}

module.exports = bdbApi;
