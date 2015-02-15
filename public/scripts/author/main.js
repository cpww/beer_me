angular.module('app', [function(){
  console.log('Beer up!');
}])

.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.submit = function(beer) {
    var dev = {'beer': beer, 'mock': true},
    prod    = {'beer': beer, 'mock': false};

    $http.post('/api/v1/beers/', dev)
    .success(function(data) {
      if (data) {
        console.log('Data recieved: ', data);
        $scope.name = data.breweryDB.name;
        $scope.description = data.breweryDB.description;
        $scope.label = data.breweryDB.labels.medium;
      } else {
        console.log('No data received!');
      }
    })
    .error(function(data) {
      console.log('Something fucked!');
    });
  }
}]);

