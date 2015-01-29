var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var routes = require('./routes/index');
var secrets = require('./secrets');
var mocks = require('./mocks');
var users = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res, next) {
    console.log('routing to index');
    res.render('index');
    });

app.post('/api/v1/beers', function(req, res, next) {
    // Construct the brewerydb endpoint to hit
    if (req.body.mock) {
        res.send(JSON.stringify(mocks.oneBeer));
    }
    else {
        var endpoint = 'http://api.brewerydb.com/v2/search?q=' + encodeURIComponent(req.body.beer) + '&key=' + secrets.bdbKey

        // Hit the endpoint
        request(endpoint, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body).data;

                // Create an array that filters the return data such that the last
                // entry in the array will be the data entry that had the most words
                // that matched the original queried beer
                var matchWords = req.body.beer.split(' ')
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
                res.send(JSON.stringify(data[bestMatchI]));
            }
        })
    }
});

// catch 404 and forward to error handler
// This is due to the way express attemps to match a requested
// path: since no other paths can match at this point, the app
// will default to handling this function.
app.use(function(req, res, next) {
    console.log('routing to NOT index');
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
