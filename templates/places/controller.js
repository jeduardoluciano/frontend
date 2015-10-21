angular.module('appdosamba.places', [])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('app.places', {
	    url: '/places',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/places/list.html',
	        controller: 'PlaceCtrl'
	      }
	    }
	  })
	 .state('app.placeDetails', {
	    url: '/places/details/:id',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/places/details.html',
	        controller: 'PlaceDetailsCtrl'
	      }
	    }
	  })
	.state('app.placeAdd', {
	    url: '/places/add',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/places/add.html',
	        controller: 'PlaceAddCtrl'
	      }
	    }
	  })
})
.factory('PlaceService', function($http, SERVER){
	var places = [];
	
	return {
		GetPlaces: function(){
			return $http.get(SERVER.urlJSON + '/places/list.json').then(function(response){			
				places = response.data.places;								
				return places;
			})
		},
		GetPlace:function(placeId){
			$place = '';		
			places.forEach(function(e, i){
				if(e.id == placeId){
					$place =  e;
				}				
			})
			return $place;
		}
	}
})

.controller('PlaceCtrl', 
	function($scope, $state, $stateParams, $ionicLoading, PlaceService, Loading) {
		$scope.places = {}
		Loading.show();
		PlaceService.GetPlaces().then(function(places){
			$scope.places = places;
			Loading.hide();
		});
	}
)

.controller("PlaceDetailsCtrl",
	function($scope, $state, $stateParams, PlaceService){
    	var id = $stateParams.id;
    	$scope.place = PlaceService.GetPlace(id);      
   	}
)

.controller('PlaceAddCtrl', function($scope, $state, $stateParams,  AWSService ) {		
	$scope.place = {}
	$scope.addPlace = function(){		
		AWSService.SendMessageSQS($scope.place, 'places');	
	}	
})

