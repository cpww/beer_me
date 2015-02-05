angular.module('app', [function() {
	console.log('hello, world!');
}])

.controller('AppCtrl', ['$scope', function($scope, $http){
  console.log('App controller');

	var app = this;

  app.searchBeers = function(beer) {
  	console.log('my beer:' + beer);
  	$http.post("http://localhost:3000/api/v1/beers", beer)
  		.success(function(data) {
  			console.log(data);
  		})
  }

  // $scope.addBeer = function(beer) {
  // 	console.log('my beer:' + beer);
  // }
}]);

