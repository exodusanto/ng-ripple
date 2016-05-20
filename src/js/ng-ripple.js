(function(){
	var ripple = angular.module('ng-ripple', []);

	ripple.directive('ripple',function(){

		function rippleInit(scope,element,attributes){
			$(element).mousedown(function(){
				
			});
		}

		function createMarkup(element){
			var content = $(element).html();
			var markup = $("<div></div>");
			markup.addClass('ripple-cont');

			markup.append("<div class='ripple-content'>"+content+"</div>");
			markup.append("<div class='ink-content'></div>");
			
			return markup[0].outerHTML;
		}

		return {
			restrict: "EAC",
			link: rippleInit,
			template: createMarkup,
			replace: true
		}
	});
})();