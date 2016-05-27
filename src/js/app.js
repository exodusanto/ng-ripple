(function(){
	var app = angular.module('app', ["ng-ripple"]);
	
	app.run(['rippleConfig', function(rippleConfig){

		rippleConfig.rippleOpacity = .2;
		rippleConfig.rippleIncremental = 1.27;

		console.info("Configuration:",JSON.stringify(rippleConfig));

		console.info("Init application!");
	}]);
})();