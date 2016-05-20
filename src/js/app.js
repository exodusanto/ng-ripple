(function(){
	var app = angular.module('app', ["ng-ripple"]);
	
	app.run(['rippleConfig', function(rippleConfig){

		rippleConfig.rippleOpacity = .35;
		rippleConfig.rippleIncremental = 2;

		console.info("Configuration:",JSON.stringify(rippleConfig));

		console.info("Init application!");
	}]);
})();