/*!
* Author: Antonio Dal Sie
* Name: ng-ripple
* Description: Material ripple effects for angularjs
*/
(function($,exports){
	var ripple = angular.module('ng-ripple', []);
	ripple.constant('rippleConfig',{
		'rippleOpacity': .2,
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
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;


			if(typeof attributes.rDisabled == "undefined" && !elem.hasClass('disabled')){
				elem.bind('mousedown touchstart',createRipple);
			}


			function createRipple(event){

				var targetInk = $(event.target);

				if(targetInk.hasClass('r-noink') || !!targetInk.parents('.r-noink').length)return;

				if(!!overInk)rippleCont.show(0);

				var ink = $("<i class='ink'></i>");
				var incr = 0;

				rippleCont.find(".ink").removeClass('new');
				ink.addClass('new');

				rippleCont.prepend(ink);
				
				
				incr = icon ? rippleConfig.rippleIncremental/2 : 1;
				

				var x = event.type != "touchstart" ? 
					event.pageX - rippleCont.offset().left : 
					event.originalEvent.touches[0].pageX - rippleCont.offset().left;

				var y = event.type != "touchstart" ? 
					event.pageY - rippleCont.offset().top :
					event.originalEvent.touches[0].pageY - rippleCont.offset().top;

				if(!icon){
					ink.css({top: y+'px', left: x+'px'});
				}
				
				x = x > rippleCont.width()/2 ? x - rippleCont.width()/2 : rippleCont.width()/2 - x;
				y = y > rippleCont.height()/2 ? y - rippleCont.height()/2 : rippleCont.height()/2 - y;

				var d = Math.max(rippleCont.outerWidth() + x, rippleCont.outerHeight() + y);
				
				ink.css({height: d*incr, width: d*incr});

				ink.css("opacity",0);
				
				var inkOpacity = customOpacity || rippleConfig.rippleOpacity;
				
				rippleCont.css("background-color",'rgba(0,0,0,'+.098+')');

				if(!!inkColor){
					ink.css("background-color",inkColor);

					var rgba = hexToRGB(inkColor);
					rippleCont.css("background-color",'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+.098+')')
				}else if(!!inkLight){
					ink.css("background-color","rgb(255,255,255)");
					rippleCont.css("background-color",'rgba(255,255,255,'+.098+')');
				}

				ink.addClass('animate');


				ink.css({opacity: inkOpacity});
				
				var inkGrow = null;

				function hoverIncrement(){
					
					inkGrow = setInterval(function(){
						if(incr <= rippleConfig.rippleIncremental){
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
					$(window).bind('mouseup blur touchend', removeInk);
					elem.bind('mouseleave',removeInk);
				}

				function removeInk(){
					$(window).unbind('mouseup blur touchend', removeInk);
					elem.unbind('mouseleave', removeInk);

					clearInterval(inkGrow);

					var delay = incr < rippleConfig.rippleIncremental ? 150 : 1;
					incr = incr < rippleConfig.rippleIncremental ? rippleConfig.rippleIncremental : incr;
					setTimeout(function(){
						ink.css({
							height: d*incr,
							width: d*incr,
							opacity:0
						});
						if(!!ink.hasClass('new'))rippleCont.css("background-color","");
						setTimeout(function(){
							ink.remove();
							if(!!overInk && !rippleCont.find(".ink").length)rippleCont.hide(0);
						},450);
					},delay);
				}

				hoverIncrement();

				if(event.type == "mousedown" && event.which !== 1){
					setTimeout(function(){
						removeInk();
					},100);
				}else{
					listenerPress();
				}
			}
		}

		function hexToRGB(hex){

			var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
			var matches = patt.exec(hex);

			return {
				r:parseInt(matches[1], 16),
				g:parseInt(matches[2], 16),
				b:parseInt(matches[3], 16)
			};
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