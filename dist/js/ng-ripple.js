/*!
* Author: Antonio Dal Sie
* Name: ng-ripple
* Description: Material ripple effects for angularjs
*/
(function(exports){
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
			
			elem = element[0];
			rippleCont = elem.querySelectorAll(".ink-content")[0];

			element.on("$destroy",function(){
				elem.removeEventListener('mousedown',createRipple);
			});

			icon = hasClass(elem,'r-icon');
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;

			console.log(elem,!hasClass(elem,'disabled'));

			if(typeof attributes.rDisabled == "undefined" && !hasClass(elem,'disabled')){
				elem.addEventListener('mousedown',createRipple);
			}


			function createRipple(event){
				var ink = document.createElement("i");
				var incr = 0;

				addClass(ink,'ink');

				rippleCont.insertBefore(ink,rippleCont.firstChild);
				
				var d = Math.max(rippleCont.offsetWidth, rippleCont.offsetHeight);
				
				ink.style.height = d/2;
				ink.style.width = d/2;
				
				
				var x = event.pageX - offestElm(rippleCont).left;
				var y = event.pageY - offestElm(rippleCont).top;
				
				
				if(!icon){
					ink.style.top = y+'px';
					ink.style.left = x+'px';
				}

				ink.style.opacity = 0;

				if(!!inkColor){
					ink.style.backgroundColor = inkColor;
				}else if(!!inkLight){
					ink.style.backgroundColor = "rgb(255,255,255)";
				}

				addClass(ink,'animate');

				incr = icon ? rippleConfig.rippleIncremental/2 : rippleConfig.rippleIncremental;

				ink.style.height = d*incr+"px";
				ink.style.width = d*incr+"px";


				var inkOpacity = customOpacity || rippleConfig.rippleOpacity;

				ink.style.opacity = inkOpacity;
				
				var inkGrow = null;

				function hoverIncrement(){
					inkGrow = setTimeout(function(){
						inkGrow = setInterval(function(){
							if(incr <= 2.5){
								incr += .2;
								ink.style.height = d*incr+"px";
								ink.style.width = d*incr+"px";
							}else{
								clearInterval(inkGrow);
							}
						},50);
					},100);
				}
				
				function removeInk(){
					addListenerMulti(window,'mouseup mouseleave blur',function(){
						removeListenerMulti(this,'mouseup mouseleave blur',this);

						clearInterval(inkGrow);

						setTimeout(function(){

							ink.style.opacity = 0;

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

		function addClass(e,name){
			if (e.classList){
			  e.classList.add(name);
			}else{
			  e.className += ' ' + name;
			}
		}

		function hasClass(e,name){
			if (e.classList){
			  return e.classList.contains(name);
			}else{
			  return new RegExp('(^| )' + name + '( |$)', 'gi').test(e.className);
			}
		}

		function offestElm(el){
			var rect = el.getBoundingClientRect();

			return{
			  top: rect.top + document.body.scrollTop,
			  left: rect.left + document.body.scrollLeft
			}
		}

		function addListenerMulti(el, s, fn) {
		  var evts = s.split(' ');
		  for (var i=0, iLen=evts.length; i<iLen; i++) {
		    el.addEventListener(evts[i], fn, false);
		  }
		}

		function removeListenerMulti(el, s, fn) {
		  var evts = s.split(' ');
		  for (var i=0, iLen=evts.length; i<iLen; i++) {
		    el.removeEventListener(evts[i], fn, false);
		  }
		}


		function createMarkup(element){
			var content = element[0].innerHTML;
			var markup = document.createElement("button");
			if(element.prop('nodeName').toLowerCase() != "ripple"){
				var cloneElement = element[0].cloneNode(true);
				cloneElement.innerHTML = '';
				cloneElement.className = cloneElement.className.replace(/\b(ripple)(\s)*\b/,'');

				cloneElement.removeAttribute("ripple");
				cloneElement.removeAttribute("data-ripple");

				markup = cloneElement;
			}

			addClass(markup,'ripple-cont');

			markup.innerHTML += "<span class='ripple-content'>"+content+"</span>";
			markup.innerHTML += "<div class='ink-content'></div>";
			
			return markup.outerHTML;
		}

		return {
			restrict: "AEC",
			link: rippleInit,
			template: createMarkup,
			replace: true
		}
	}]);
})(window);