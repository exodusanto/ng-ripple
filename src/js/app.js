(function(){
	var app = angular.module('app', ["ngRipple"]);
	
	app.run(['rippleConfig', function(rippleConfig){

		rippleConfig.rippleOpacity = .2;
		rippleConfig.rippleDelay = 0;

		console.info("Configuration:",JSON.stringify(rippleConfig));

		console.info("Init application!");
	}]);
})();