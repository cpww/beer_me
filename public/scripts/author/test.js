angular.module('app', [function() {
	console.log('hello, world!');
}])

.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
  console.log('App controller');

	var app = this;

  $scope.searchBeers = function(beer) {
  	console.log('my beer:' + beer);
  	// $http.post("/api/v1/beers", {'beer': beer}) // Real results
    $http.post("/api/v1/beers", {'beer': beer, 'mock': true}) // Mock results
  		.success(function(data) {
        if (data) {
          console.log('Data received:',data);
        }
  			else {
          console.log('No data returned.');
        }
  		}).error(function(data){
        console.log('Something fucked up.');
      });
  }
}]);
