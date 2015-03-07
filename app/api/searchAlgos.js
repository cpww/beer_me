var search = {
    // Takes beer(string) and data(array of strings)
    // Finds and returns index of the closest match data
    'searchBeer': function(beer, data) {
        // Create an array that filters the return data such that the last
        // entry in the array will be the data entry that had the most words
        // that matched the original queried beer
        var matchWords = beer.split(' ');
        var matches = 0;
        var bestMatchI = 0;
        for (i = 0; i < data.length; i++) {

            // Determine the number of words in the current datum that match
            // words in the original beer search
            var curMatches = data[i].split(' ').filter( function(word) {
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

        return bestMatchI;
    },

    // Takes user(array with 2 numbers) and options array of
    // multiple arrays that take two numbers
    // Returns array that is closet to the user's coordinates
    'searchLocation': function(user, options) {
        var currentClosest;
        var currentClosestIndex;

        options.forEach(function(elem, idx) {
            var latDiff = Math.abs(user[0]-elem[0]);
            var longDiff = Math.abs(user[1]-elem[1]);
            if (latDiff+longDiff < currentClosest || typeof currentClosest === 'undefined') {
                currentClosest = latDiff+longDiff;
                currentClosestIndex = idx;
            }
        });
        return {'coords': options[currentClosestIndex], 'index': currentClosestIndex};
    }
}

module.exports = search;