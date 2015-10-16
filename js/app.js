angular.module('App', ['ionic', 'ionic-material', 'ngCordova'])

.constant('SERVER', {
	urlJSON: 'https://s3.amazonaws.com/app-samba/json'
})

.run(function($ionicPlatform) {
	
	//test
	
	console.log(1);
  $ionicPlatform.ready(function() {
   
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    
    if (window.StatusBar) {      
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	
	.state('app', {
	    url: '/app',
	    abstract: true,
	    templateUrl: 'templates/menu.html',
	    controller: 'AppCtrl'
	})
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
	  
	  $urlRouterProvider.otherwise('/app/places');
})
.factory('Loading', function($ionicLoading){
	return {
		show: function(){
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
		},
		hide: function(){
			$ionicLoading.hide();
		}
	}
})


.factory('AWSService', function ($ionicPopup, Loading){
	
	return {
		SendMessageSQS: function(message, queue){
			var m = null;
			Loading.show();
			
			// Initialize the Amazon Cognito credentials provider
			AWS.config.region = 'us-east-1'; // Region
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			    IdentityPoolId: 'us-east-1:66e63cea-a81e-453a-bcb4-7407324f5f0c',
			});
			
			var params = {
			    MessageBody: JSON.stringify(message),
			    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/309276238607/' + queue,
			    DelaySeconds: 0
			};
					
			var sqs = new AWS.SQS();
				
			sqs.sendMessage(params, function (err, data) {
			    if (err) {
			    	Loading.hide();
			    	$ionicPopup.alert({	title: 'Erro',template: 'Ops!! Ocorreu um erro.'});
			    } // an error occurred
			    else {
			    	Loading.hide();
			    	$ionicPopup.alert({	title: 'Informe',template: 'Dados enviados com sucesso, dentro de alguns minutos o conteúdo será validado!'});			    	
			    }
			});			
		},
		
		SendFileS3: function(file){
			AWS.config.region = 'us-east-1'; // Region
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			    IdentityPoolId: 'us-east-1:66e63cea-a81e-453a-bcb4-7407324f5f0c',
			});
		
			  var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
			 
			  if(file) {
			    var params = { Key: file.name, ContentType: file.type, Body: file, ServerSideEncryption: 'AES256' };
			 
			    bucket.putObject(params, function(err, data) {
			      if(err) {
			        // There Was An Error With Your S3 Config
			        alert(err.message);
			        return false;
			      }
			      else {
			        // Success!
			        alert('Upload Done');
			      }
			    })
			    .on('httpUploadProgress',function(progress) {
			          // Log Progress Information
			          console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
			        });
			  }
			  else {
			    // No File Selected
			    alert('No File Selected');
			  }
		}
	}
		
})

.controller('AppCtrl', function($scope, $state) {
  
})
