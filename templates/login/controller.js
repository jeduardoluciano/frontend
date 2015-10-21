angular.module('appdosamba.login', [])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('app.login', {
	    url: '/login',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/login/login.html',
	        controller: 'LoginCtrl'
	      }
	    }
	  })
})

.controller('LoginCtrl', function($scope, $state, $stateParams ) {		
	
})
