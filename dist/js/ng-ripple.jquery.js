/*!
* Author: Antonio Dal Sie
* Name: ng-ripple
* Description: Material ripple effects for angularjs
*/
(function($,exports){
	var ripple = angular.module('ng-ripple', []);
	ripple.constant('rippleConfig',{
		'rippleOpacity': .2,
		'rippleDelay': 100
	});

	ripple.directive('ripple',['rippleConfig', function(rippleConfig){
		
		var rippleEventArray = [];

		function rippleInit(scope,element,attributes){
			var elem = null;
			var rippleCont = null;
			var inkLight = false;
			var inkColor = false;
			var customOpacity = null;
			var icon = false;
			var overInk = false;
			var preventInk = false;
			
			elem = $(element);
			elem.removeClass('ripple');
			rippleCont = elem.children(".ink-content");

			element.on("$destroy",function(){
				elem.unbind('mousedown touchstart',createRipple);
			});

			icon = elem.hasClass('r-icon');
			overInk = elem.hasClass('r-overink');
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;
			preventInk = typeof attributes.rPrevent !== "undefined" ? attributes.rPrevent : false;


			elem.bind('mousedown touchstart',createRipple);


			function createRipple(event){
				
				event.preventDefault();

				if(rippleEventArray.indexOf(event.timeStamp) != -1)return;
				rippleEventArray.push(event.timeStamp);

				var targetInk = $(event.target);

				if(typeof attributes.rDisabled != "undefined" || elem.hasClass('disabled'))return;
				if(targetInk.hasClass('r-noink') || !!targetInk.parents('.r-noink').length)return;
				if(!!preventInk && elem.is(preventInk))return;

				if(!!overInk)rippleCont.show(0);

				var inkWrapper = $("<div class='ink'><i></i></div>");
				var ink = inkWrapper.find("i");
				var incr = 0;
				var incrmax = 0;

				rippleCont.find(".ink").removeClass('new');
				inkWrapper.addClass('new');

				rippleCont.prepend(inkWrapper);

				//Set x and y position inside ripple content
				var x = event.type != "touchstart" ? 
					event.pageX - rippleCont.offset().left : 
					event.originalEvent.touches[0].pageX - rippleCont.offset().left;

				var y = event.type != "touchstart" ? 
					event.pageY - rippleCont.offset().top :
					event.originalEvent.touches[0].pageY - rippleCont.offset().top;

				// if icon set default position: 50% 50%
				if(!icon){
					inkWrapper.css({top: y+'px', left: x+'px'});
					
					//Set translate of user from center of ripple content
					x = x > rippleCont.outerWidth()/2 ? x - rippleCont.outerWidth()/2 : rippleCont.outerWidth()/2 - x;
					y = y > rippleCont.outerHeight()/2 ? y - rippleCont.outerHeight()/2 : rippleCont.outerHeight()/2 - y;
				}else{
					x = 0;
					y = 0;
				}
				

				//Set max between width and height
				var bd = Math.max(rippleCont.outerWidth(), rippleCont.outerHeight());
				//Set total translate
				var tr = x + y;
				//Set diagonal of ink circle
				var d = bd + tr;
				//Set default diameter without translate
				bd -= tr;

				var h = rippleCont.outerHeight();
				var w = rippleCont.outerWidth();

				//Set diagonal of ripple container
				var diag = Math.sqrt(w * w + h * h);
				//Set incremental diameter of ripple
				var incrmax = (diag - bd);
				
				incrmax = icon ? 0 : incrmax;

				inkWrapper.css({height: d+incr, width: d+incr});

				ink.css("opacity",0);
				
				var inkOpacity = customOpacity || rippleConfig.rippleOpacity;

				if(!!inkColor){
					ink.css("background-color",inkColor);
				}else if(!!inkLight){
					ink.css("background-color","rgb(255,255,255)");
				}

				if(!icon){
					rippleCont.css("background-color",'rgba(0,0,0,'+.098+')');
					
					if(!!inkColor){
						var rgba = hexToRGB(inkColor);
						rippleCont.css("background-color",'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+.098+')');
					}else if(!!inkLight){
						rippleCont.css("background-color",'rgba(255,255,255,'+.098+')');
					}
				}

				setTimeout(function(){
					inkWrapper.addClass('animate');
				},1);

				// ink.css({height: d+incr, width: d+incr});

				ink.css({opacity: inkOpacity});
				
				var inkGrow = null;

				function hoverIncrement(){
					var incrStep = ((incrmax - incr)/100)*10
					inkGrow = setInterval(function(){
						if(incr < incrmax){
							incr += incrStep;
							inkWrapper.css({
								height: d+incr,
								width: d+incr
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

					var delay = incr <= incrmax ? rippleConfig.rippleDelay : 1;
					incr = incr < incrmax ? incrmax : incr;
					inkWrapper.css({
							height: d+incr,
							width: d+incr
					});
					setTimeout(function(){
						ink.css({
							opacity:0
						});
						if(!!inkWrapper.hasClass('new') && !icon)rippleCont.css("background-color","");
						setTimeout(function(){
							inkWrapper.remove();
							if(!!overInk && !rippleCont.find(".ink").length)rippleCont.hide(0);
						},550);
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