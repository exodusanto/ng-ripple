/*!
* Author: Antonio Dal Sie
* Name: ng-ripple
* Description: Material ripple effects for angularjs
*/
(function($,exports){
	var ripple = angular.module('ng-ripple', []);
	ripple.constant('rippleConfig',{
		'rippleOpacity': .35,
		'rippleIncremental': 2
	});

	ripple.directive('ripple',['rippleConfig', function(rippleConfig){

		function rippleInit(scope,element,attributes){
			var elem = null;
			var rippleCont = null;
			var inkLight = false;
			var inkColor = false;
			var customOpacity = null;
			var icon = false;
			
			elem = $(element);
			elem.removeClass('ripple');
			rippleCont = elem.find(".ink-content");

			element.on("$destroy",function(){
				elem.unbind('mousedown touchstart',createRipple);
			});

			icon = elem.hasClass('r-icon');
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;

			if(typeof attributes.rDisabled == "undefined" && !elem.hasClass('disabled')){
				elem.bind('mousedown touchstart',createRipple);
			}


			function createRipple(event){
				var ink = $("<i class='ink'></i>");
				var incr = 0;

				rippleCont.prepend(ink);
				
				var d = Math.max(rippleCont.outerWidth(), rippleCont.outerHeight());
				
				ink.css({height: d/2, width: d/2});
				
				
				var x = event.pageX - rippleCont.offset().left;
				var y = event.pageY - rippleCont.offset().top;
				
				
				if(!icon){
					ink.css({top: y+'px', left: x+'px'});
				}

				ink.css("opacity",0);

				if(!!inkColor){
					ink.css("background-color",inkColor);
				}else if(!!inkLight){
					ink.css("background-color","rgb(255,255,255)");
				}

				ink.addClass('animate');

				incr = icon ? rippleConfig.rippleIncremental/2 : rippleConfig.rippleIncremental;

				ink.css({
					height: d*incr,
					width: d*incr
				});


				var inkOpacity = customOpacity || rippleConfig.rippleOpacity;

				ink.css({opacity: inkOpacity});
				
				var inkGrow = null;

				function hoverIncrement(){
					inkGrow = setTimeout(function(){
						inkGrow = setInterval(function(){
							if(incr <= 2.5){
								incr += .2;
								ink.css({
									height: d*incr,
									width: d*incr
								});
							}else{
								clearInterval(inkGrow);
							}
						},50);
					},100);
				}
				
				function removeInk(){
					$(window).bind('mouseup mouseleave blur touchend',function(){
						$(this).unbind();

						clearInterval(inkGrow);

						setTimeout(function(){
							ink.css({
								opacity:0
							});
							setTimeout(function(){
								ink.remove();
							},550);
						},100);
					});
				}

				hoverIncrement();
				removeInk();
			}
		}


		function createMarkup(element){
			var content = $(element).html();
			var markup = $("<button></button>");

			if($(element).prop('nodeName').toLowerCase() != "ripple"){
				var cloneElement = $(element).clone();
				$(cloneElement).empty();
				cloneElement[0].className = "";
				$(cloneElement).removeClass('ripple');
				$(cloneElement).removeAttr('ripple');
				$(cloneElement).removeAttr('data-ripple')
				$(cloneElement).removeAttr('ng-ripple')
				markup = $(cloneElement);
			}

			markup.addClass('ripple-cont');

			markup.append("<div class='ripple-content'>"+content+"</div>");
			markup.append("<div class='ink-content'></div>");
			console.log(markup[0].outerHTML);
			return markup[0].outerHTML;
		}

		return {
			restrict: "AEC",
			link: rippleInit,
			template: createMarkup,
			replace: true
		}
	}]);
})(jQuery,window);