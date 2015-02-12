var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var Q = require('q');

var debug = require('debug')('app4');

var routes = require('./routes/index');
var secrets = require('./secrets');
var mocks = require('./mocks');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));

app.use('/', routes);
app.use('/users', users);

function getResults(beer) {
    var brewerydbEndpoint = 'http://api.brewerydb.com/v2/search?q=' + encodeURIComponent(beer) + '&key=' + secrets.bdbKey
    var untappdEndpoint = 'http://api.brewerydb.com/v2/search?q=' + encodeURIComponent(beer) + '&key=' + secrets.bdbKey
    return Q.all([Q.nfcall(request, brewerydbEndpoint),
                  Q.nfcall(request, untappdEndpoint)])
    .spread(function(brewerydbRes, untappdRes) {        
        return [brewerydbRes[1], untappdRes[1]];  // return the response body
    })
    .fail(function(err) {
        console.error(err)
        return err;
    });
}

function parseBrewerydbResponse(beer, response) {
    var data = JSON.parse(response).data;

    if (data === undefined) {
        return {'searchedBeer': beer}
    }

    // Create an array that filters the return data such that the last
    // entry in the array will be the data entry that had the most words
    // that matched the original queried beer
    var matchWords = beer.split(' ')
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

function parseUntappdResponse(beer, response) {
    var data = JSON.parse(response).data;

    if (data === undefined) {
        return {'searchedBeer': beer}
    }

    // Create an array that filters the return data such that the last
    // entry in the array will be the data entry that had the most words
    // that matched the original queried beer
    var matchWords = beer.split(' ')
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

app.post('/api/v1/beers', function(req, res, next) {
    // Construct the brewerydb endpoint to hit
    var beer = req.body.beer
    if (req.body.mock) {
        if (beer == 'no_beer') {
            res.send(JSON.stringify(mocks.noBeer));
        } else if (beer == 'no_image') {
            res.send(JSON.stringify(mocks.noImage));
        } else {
            res.send(JSON.stringify(mocks.oneBeer));
        }
    }
    else {
        getResults(beer).then(function(responses) {
            var bdbResp = responses[0]
            var utResp = responses[1]
            var resp = {'breweryDB': parseBrewerydbResponse(beer, bdbResp),
                        'untappd': parseUntappdResponse(beer, utResp)}
            res.send(JSON.stringify(resp));
        });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
