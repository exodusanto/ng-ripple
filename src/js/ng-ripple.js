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
			var rippleCont = null;
			var inkLight = false;
			var inkColor = false;
			var customOpacity = null;
			var icon = false;
			var overInk = false;
		
			removeClass(element,'ripple');
			rippleCont = element[0].querySelectorAll(".ink-content")[0];

			element.on("$destroy",function(){
				removeListenerMulti(element[0],"mousedown touchstart",createRipple);
			});

			icon = hasClass(element,'r-icon');
			overInk = hasClass(element,'r-overink');
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;

			if(typeof attributes.rDisabled == "undefined" && !hasClass(element,'disabled')){
				addListenerMulti(element[0],"mousedown touchstart",createRipple);
			}


			function createRipple(event){
				var targetInk = $(event.target);

				if(hasClass(targetInk,'r-noink') || !!parents(targetInk,'.r-noink').length)return;

				if(!!overInk)rippleCont.style.display = "block";


				var ink = document.createElement("i");
				var incr = 0;

				addClass(ink,'ink');

				removeClass(rippleCont.querySelectorAll(".ink"),'new');
				addClass(ink,'new');

				rippleCont.insertBefore(ink,rippleCont.firstChild);
				
				var d = Math.max(rippleCont.offsetWidth, rippleCont.offsetHeight);
				
				ink.style.height = d/2+"px";
				ink.style.width = d/2+"px";

				var x = event.type != "touchstart" ? 
					event.pageX - offestElm(rippleCont).left : 
					event.originalEvent.touches[0].pageX - offestElm(rippleCont).left;

				var y = event.type != "touchstart" ? 
					event.pageY - offestElm(rippleCont).top :
					event.originalEvent.touches[0].pageY - offestElm(rippleCont).top;
				
				
				if(!icon){
					ink.style.top = y+'px';
					ink.style.left = x+'px';
				}

				ink.style.opacity = 0;

				if(!!inkColor){
					ink.style.backgroundColor = inkColor;

					var rgba = hexToRGB(inkColor);
					rippleCont.style.backgroundColor = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+.098+')';
				}else if(!!inkLight){
					ink.style.backgroundColor = "rgb(255,255,255)";
					rippleCont.style.backgroundColor = 'rgba(255,255,255,'+.098+')';
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

				function listenerPress(){
					addListenerMulti(window,'mouseup blur touchend',removeInk);
					addListenerMulti(element[0],'mouseleave',removeInk);
				}
				
				function removeInk(){
					removeListenerMulti(window,'mouseup mouseleave touchend',removeInk);
					removeListenerMulti(element[0],'mouseleave',removeInk);

					clearInterval(inkGrow);

					var delay = incr < 2 && element.prop('nodeName').toLowerCase() == 'a' ? 100 : 1;
					incr = incr < 2 ? 2 : incr += .5;
					setTimeout(function(){
						ink.style.height = d*incr+"px",
						ink.style.width = d*incr+"px",
						ink.style.opacity = 0

						if(!!hasClass(ink,'new'))rippleCont.style.backgroundColor = "";
						setTimeout(function(){
							ink.remove();
							if(!!overInk && !rippleCont.querySelectorAll(".ink").length)rippleCont.style.display = "none";
						},650);
					},delay);
				}

				hoverIncrement();
				listenerPress();
			}
		}

		function parents(el,sl){
			var parents = [];

			var p = el[0].parentNode;

			while(p !== null){
				var o = p;

				if(hasClass(o,sl))parents.push(o);
				p = o.parentNode;
			}
			return parents;
		}

		function addClass(el,name){
			var ex = typeof el.length != "undefined" ? el.length > 0 : !!el && el != [];
			if(ex && el != []){
				if(Array.isArray(el)){
					el.forEach(function(e){
						if (e.classList){
						  e.classList.add(name);
						}else{
						  e.className += ' ' + name;
						}
					});
				}else{
					if (el.classList){
					  el.classList.add(name);
					}else{
					  el.className += ' ' + name;
					}
				}
			}
		}

		function removeClass(el,name){
			var ex = typeof el.length != "undefined" ? el.length > 0 : !!el && el != [];
			if(ex){
				if(Array.isArray(el)){
					el.forEach(function(e){
						if (e.classList){
						  e.classList.remove(name);
						}else{
						  e.className = e.className.replace(new RegExp("/("+name+")\s/"),"");
						}
					});
				}else{
					el = el[0];
					if (el.classList){
					  el.classList.remove(name);
					}else{
					  el.className = el.className.replace(new RegExp("/("+name+")\s/"),"");
					}
				}
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