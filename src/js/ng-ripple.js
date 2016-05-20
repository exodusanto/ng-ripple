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
			rippleCont = elem.find(".ink-content");

			icon = elem.hasClass('r-icon');
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;

			if(typeof attributes.rDisabled == "undefined" && !elem.hasClass('disabled')){
				elem.mousedown(function(event){
					createRipple(event);
				});
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
					$(window).bind('mouseup mouseleave blur',function(){
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
				$(cloneElement).removeClass('ripple');
				$(cloneElement).attr('ripple');
				$(cloneElement).empty();
				markup = $(cloneElement);
			}

			markup.addClass('ripple-cont');

			markup.append("<span class='ripple-content'>"+content+"</span>");
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