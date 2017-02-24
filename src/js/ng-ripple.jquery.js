/*!
* Author: Antonio Dal Sie
* Name: ng-ripple
* Description: Material ripple effects for angularjs
*/
(function($,exports){
	var ripple = angular.module('ngRipple', []);
	ripple.constant('rippleConfig',{
		'rippleOpacity': .2,
		'rippleDelay': 100,
		'mobileTouch': false
	});

	ripple.directive('ripple',['rippleConfig', function(rippleConfig){
		
		var rippleEventArray = [];

		function rippleInit(scope,element,attributes){
			var elem = null;
			var inkLight = false;
			var inkColor = false;
			var customOpacity = null;
			var icon = false;
			var overInk = false;
			var preventInk = false;
			var enableClick = false;
			var mobiledevice = ('ontouchstart' in document.documentElement);
			
			elem = $(element);
			overInk = elem.hasClass('r-overink');

			if(typeof PointerEventsPolyfill !== "undefined"){
				PointerEventsPolyfill.initialize({
					'selector': elem,
					'mouseEvents': ['click','dblclick']
				});
			}

			elem.addClass('ripple');
			
			if(overInk){
				elem.removeAttr('href');
			}

			enableClick = elem.find(".r-noink-hover").length > 0;
			
			var listenType = {
				"start" : ('ontouchstart' in document.documentElement) 
						? !!rippleConfig.mobileTouch 
							? 'touchstart'
							: 'click'
						: 'mousedown',
				"end" : ('ontouchend' in document.documentElement) ? 'touchend' : 'mouseup dragend'
			};

			element.on("$destroy",function(){
				elem.unbind(listenType.start,createRipple);
			});

			icon = elem.hasClass('r-icon');
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;
			preventInk = typeof attributes.rPrevent !== "undefined" ? attributes.rPrevent : false;

			elem.unbind(listenType.start,createRipple);
			elem.bind(listenType.start,createRipple);

			if(!!enableClick && (!mobiledevice || !!rippleConfig.mobileTouch)){
				elem.find(".r-noink-hover").unbind("click",createRipple);
				elem.find(".r-noink-hover").bind("click",createRipple);
			}


			function createRipple(event){
				var blockedAll = false;
				var timeStamp = event.timeStamp;

                if(timeStamp == 0){
                    var date = new Date();
                    timeStamp = date.getTime();
                }

                var elem = $(event.currentTarget).closest('.ripple-cont');
                var rippleCont = elem.children(".ink-content");

				if($(elem).hasClass('r-childprevent')) return $(elem).removeClass('r-childprevent');
				$(elem).parents(".ripple-cont").addClass('r-childprevent');
				
				if(rippleEventArray.indexOf(timeStamp) != -1)return;
				rippleEventArray.push(timeStamp);

				var targetInk = $(event.target);

				if(typeof attributes.rDisabled != "undefined" || $(elem).hasClass('disabled'))return;
				if(targetInk.hasClass('r-noink') || !!targetInk.parents('.r-noink').length)return;
				if((event.type == "mousedown" || event.type == "touchstart") && (targetInk.hasClass('r-noink-hover') || !!targetInk.parents('.r-noink-hover').length))return;
				if(event.type == "click" && !mobiledevice && !targetInk.hasClass('r-noink-hover') && !targetInk.parents('.r-noink-hover').length)return;
				if(!!preventInk && $(elem).is(preventInk))return;

				$(window).bind("stopAllInk", forceRemoveInk);
				$(window).bind("explodeAllInk", removeInk);
				if(blockedAll == true) return; // block all start

				if(!!overInk)rippleCont.show(0);

				var inkWrapper = $("<div class='ink'><i></i></div>");
				var ink = inkWrapper.find("i");
				var incr = 0;
				var incrmax = 0;
				var longTouch = null;
				var scrollTouch = null;

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
				
				if(blockedAll == true) return; // block all calc

				//Set total translate
				var tr = (x*2) + (y*2);

				var h = rippleCont.outerHeight();
				var w = rippleCont.outerWidth();

				//Set diagonal of ripple container
				var d = Math.sqrt(w * w + h * h);
				//Set incremental diameter of ripple
				var incrmax = tr;
				
				incrmax = icon ? 0 : incrmax;

				inkWrapper.css({height: d, width: d});

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
					if(blockedAll == true) return; // block all animation
					inkWrapper.addClass('animate');
				},1);

				if(blockedAll == true) return; // block all opacity
				ink.css({opacity: inkOpacity});

				
				var inkGrow = null;

				function hoverIncrement(){
					var incrStep = ((incrmax - incr)/100)*10;
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
					$(window).bind(listenType.end+' blur', removeInk);
					$(elem).bind('mouseleave',removeInk);
				}

				function removeInk(){
					$(window).unbind('stopAllInk', forceRemoveInk);
					$(window).unbind('scroll', forceRemoveInk);
					$(window).unbind('explodeAllInk', removeInk);
					$(window).unbind(listenType.end+' blur', removeInk);
					$(elem).unbind('mouseleave', removeInk);

					clearInterval(inkGrow);
					clearInterval(longTouch);
					clearInterval(scrollTouch);

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
							if(!!overInk && !rippleCont.find(".ink").length)rippleCont.css("display","");
						},550);
					},delay);
				}

				function forceRemoveInk(){
					blockedAll = true;
					$(window).unbind('stopAllInk', forceRemoveInk);
					$(window).unbind('scroll', forceRemoveInk);
					$(window).unbind('explodeAllInk', removeInk);
					$(window).unbind(listenType.end+' blur scroll', removeInk);
					elem.unbind('mouseleave', removeInk);

					clearInterval(inkGrow);
					clearInterval(longTouch);
					clearInterval(scrollTouch);

					if(!!inkWrapper.hasClass('new') && !icon)rippleCont.css("background-color","");
					inkWrapper.remove();
					if(!!overInk && !rippleCont.find(".ink").length)rippleCont.css("display","");
				}

				if(blockedAll == true) return;

				hoverIncrement();

				if(event.type == "mousedown" && event.which !== 1){
					setTimeout(function(){
						removeInk();
					},100);
				}else if(event.type == "click"){
					setTimeout(function(){
						removeInk();
					},100);
				}else if(event.type == "touchstart"){
					longTouch = setTimeout(function(){
						removeInk();
					},1000);
					$(window).bind('scroll',forceRemoveInk);
					scrollTouch = setTimeout(function(){
						$(window).unbind('scroll',forceRemoveInk);
					},500);
					listenerPress();
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
			if($(element).hasClass('ripple-cont')){
				while($(element)[0].attributes.length > 0){
   					$(element)[0].removeAttribute($(element)[0].attributes[0].name);
				}
				return element[0].outerHTML;
			}

			var content = $(element).html();
			var markup = $("<button></button>");
			var overink = element.hasClass('r-overink');

			if(overink){
				markup = $("<div></div>");
				var replacement = $("<button></button>");
			}


			if($(element).prop('nodeName').toLowerCase() != "ripple"){
				var cloneElement = $(element).clone();
				cloneElement = $(cloneElement);
				cloneElement.empty();
				cloneElement.prop('className', "");
				cloneElement.removeAttr('ripple');
				cloneElement.removeAttr('data-ripple');

				$.each(cloneElement.prop('attributes'),function(index,attribute){
					if(attribute.name.match(/^ng-*/)){
						cloneElement.removeAttr(attribute.name);
					}
				});
				
				if(overink){
					replacement = cloneElement;
				}else{
					markup = cloneElement;
				}
			}

			markup.addClass('ripple-cont');

			if(overink){
				replacement.addClass('ripple-content');
				replacement.html(content);

				markup.append(replacement);
			}else{
				markup.append("<div class='ripple-content'>"+content+"</div>");
			}

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