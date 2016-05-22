/*!
* Author: Antonio Dal Sie
* Name: ng-ripple
* Description: Material ripple effects for angularjs
*/
(function($,exports){
	var ripple = angular.module('ng-ripple', []);
	ripple.constant('rippleConfig',{
		'rippleOpacity': .35,
		'rippleIncremental': 1.27
	});

	ripple.directive('ripple',['rippleConfig', function(rippleConfig){

		function rippleInit(scope,element,attributes){
			var elem = null;
			var rippleCont = null;
			var inkLight = false;
			var inkColor = false;
			var customOpacity = null;
			var icon = false;
			var overInk = false;
			
			elem = $(element);
			elem.removeClass('ripple');
			rippleCont = elem.find(".ink-content");

			element.on("$destroy",function(){
				elem.unbind('mousedown touchstart',createRipple);
			});

			icon = elem.hasClass('r-icon');
			overInk = elem.hasClass('r-overink');
			overInk = typeof attributes.rOverink !== "undefined";
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;


			if(typeof attributes.rDisabled == "undefined" && !elem.hasClass('disabled')){
				elem.bind('mousedown touchstart',createRipple);
			}


			function createRipple(event){

				var targetInk = $(event.target);

				if(targetInk.hasClass('r-noink') || !!targetInk.parents('.r-noink').length)return;
				if(event.type == "mousedown" && event.which !== 1)return; // prevent other button

				if(!!overInk)rippleCont.show(0);

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
					
					inkGrow = setInterval(function(){
						if(incr <= 3){
							incr += .2;
							ink.css({
								height: d*incr,
								width: d*incr
							});
						}else{
							clearInterval(inkGrow);
						}
					},50);
				}
				
				function listenerPress(){
					$(window).bind('mouseup mouseleave blur touchend', removeInk);
				}

				function removeInk(){
					$(window).unbind('mouseup mouseleave blur touchend', this);

					clearInterval(inkGrow);

					var delay = incr < 2 && elem.prop('nodeName').toLowerCase() == 'a' ? 100 : 1;
					incr = incr < 2 ? 2 : incr += .5;
					setTimeout(function(){
							ink.css({
							height: d*incr,
							width: d*incr,
							opacity:0
						});
						setTimeout(function(){
							ink.remove();
							if(!!overInk && !rippleCont.find(".ink").length)rippleCont.hide(0);
						},650);
					},delay);
				}

				hoverIncrement();
				listenerPress();
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