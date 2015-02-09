angular.module('app', [ ])

.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.submit = function(beer) {
    var dev = {'beer': beer, 'mock': true},
    prod    = {'beer': beer, 'mock': false};

    $http.post('/api/v1/beers/', dev)
    .success(function(data) {
      if (data) {
        console.log('Data recieved: ', data);
        $scope.name = data.name;
        $scope.description = data.description;
        $scope.label = data.labels.medium;
      } else {
        console.log('No data received!');
      }
    }).error(function(data) {
      console.log('Something fucked!');
    });
  }
}]);
