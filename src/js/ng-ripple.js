(function(){
	var ripple = angular.module('ng-ripple', []);

	ripple.directive('ripple',function(){

		var elem = null;
		var rippleCont = null; 

		function rippleInit(scope,element,attributes){
			elem = $(element);
			rippleCont = elem.find(".ink-content");

			elem.mousedown(function(event){
				createRipple(event);
			});
		}

		function createRipple(event){
			var ink = $("<i class='ink'></i>");
			var opacity = 0;
			var incr = 0;

			rippleCont.prepend(ink);
			
			var d = Math.max(rippleCont.outerWidth(), rippleCont.outerHeight());
			
			ink.css({height: d/2, width: d/2});
			
			
			var x = event.pageX - rippleCont.offset().left;
			var y = event.pageY - rippleCont.offset().top;
			
			
			ink.css({top: y+'px', left: x+'px',opacity: opacity});

			ink.addClass('animate');

			incr = 2;

			ink.css({
				height: d*incr,
				width: d*incr
			});

			var end = null

			opacity = .2;
			ink.css({opacity: opacity});

			function hoverIncrement(){
				end = setTimeout(function(){
					end = setInterval(function(){
						if(opacity <= .30){
							opacity += .05;
							incr += .2;
							ink.css({
								opacity: opacity,
								height: d*incr,
								width: d*incr
							});
						}else{
							clearInterval(end);
						}
					},50);
				},100);
			}
			
			function removeInk(){
				$(window).bind('mouseup',function(){
					$(this).unbind();

					clearInterval(end);

					ink.css({
						opacity:0
					});
					setTimeout(function(){
						ink.remove();
					},550);
				});
			}

			hoverIncrement();
			removeInk();
		}

		function createMarkup(element){
			var content = $(element).html();
			var markup = $("<button></button>");

			if($(element).prop('nodeName').toLowerCase() != "ripple"){
				var cloneElement = $(element).clone();
				$(cloneElement).empty();
				markup = $(cloneElement);
			}

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