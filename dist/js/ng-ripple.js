/*!
* Author: Antonio Dal Sie
* Name: ng-ripple
* Description: Material ripple effects for angularjs
*/
(function(exports){
	var ripple = angular.module('ngRipple', []);
	ripple.constant('rippleConfig',{
		'rippleOpacity': .2,
		'rippleDelay': 100
	});

	ripple.directive('ripple',['rippleConfig', function(rippleConfig){

		var rippleEventArray = [];

		function rippleInit(scope,element,attributes){
			var rippleCont = null;
			var inkLight = false;
			var inkColor = false;
			var customOpacity = null;
			var icon = false;
			var overInk = false;
			var preventInk = false;
		
			removeClass(element,'ripple');
			rippleCont = element[0].querySelectorAll(":scope >.ink-content")[0];

			element.on("$destroy",function(){
				removeListenerMulti(element[0],"mousedown touchstart",createRipple);
			});

			icon = hasClass(element,'r-icon');
			overInk = hasClass(element,'r-overink');
			inkLight = typeof attributes.rLight !== "undefined";
			inkColor = typeof attributes.rColor !== "undefined" ? attributes.rColor : false;
			customOpacity = typeof attributes.rOpacity !== "undefined" ? attributes.rOpacity : null;
			preventInk = typeof attributes.rPrevent !== "undefined" ? attributes.rPrevent : false;

			addListenerMulti(element[0],"mousedown touchstart",createRipple);


			function createRipple(event){
				
				event.preventDefault();

				if(rippleEventArray.indexOf(event.timeStamp) != -1)return;
				rippleEventArray.push(event.timeStamp);
				
				var targetInk = $(event.target);

				if(typeof attributes.rDisabled != "undefined" || hasClass(element,'disabled'))return;
				if(hasClass(targetInk,'r-noink') || !!parents(targetInk,'r-noink').length)return;
				if(!!preventInk && elem.is(preventInk))return;

				if(!!overInk)rippleCont.style.display = "block";


				var inkWrapper = document.createElement("div");
				var ink = "<i></i>";
				var incr = 0;
				var incrmax = 0;

				inkWrapper.innerHTML = ink;
				ink = inkWrapper.querySelectorAll(":scope > i")[0];
				addClass(inkWrapper,'ink');

				removeClass(rippleCont.querySelectorAll(".ink"),'new');
				addClass(inkWrapper,'new');

				rippleCont.insertBefore(inkWrapper,rippleCont.firstChild);

				//Set x and y position inside ripple content
				var x = event.type != "touchstart" ? 
					event.pageX - offestElm(rippleCont).left : 
					event.originalEvent.touches[0].pageX - offestElm(rippleCont).left;

				var y = event.type != "touchstart" ? 
					event.pageY - offestElm(rippleCont).top :
					event.originalEvent.touches[0].pageY - offestElm(rippleCont).top;
				
				// if icon set default position: 50% 50%
				if(!icon){
					inkWrapper.style.top = y+'px';
					inkWrapper.style.left = x+'px';

					//Set translate of user from center of ripple content
					x = x > rippleCont.offsetWidth/2 ? x - rippleCont.offsetWidth/2 : rippleCont.offsetWidth/2 - x;
					y = y > rippleCont.offsetHeight/2 ? y - rippleCont.offsetHeight/2 : rippleCont.offsetHeight/2 - y;
				}else{
					x = 0;
					y = 0;
				}

				//Set total translate
				var tr = (x*2) + (y*2);

				var h = rippleCont.offsetHeight;
				var w = rippleCont.offsetWidth;

				//Set diagonal of ripple container
				var d = Math.sqrt(w * w + h * h);
				//Set incremental diameter of ripple
				var incrmax = (d + tr);
				
				incrmax = icon ? 0 : incrmax;
				
				inkWrapper.style.height = d+incr+"px";
				inkWrapper.style.width = d+incr+"px";

				var inkOpacity = customOpacity || rippleConfig.rippleOpacity;
				
				ink.style.opacity = 0;

				if(!!inkColor){
					ink.style.backgroundColor = inkColor;
				}else if(!!inkLight){
					ink.style.backgroundColor = "rgb(255,255,255)";
				}
				
				if(!icon){
					rippleCont.style.backgroundColor = 'rgba(0,0,0,'+.098+')';

					if(!!inkColor){
						var rgba = hexToRGB(inkColor);
						rippleCont.style.backgroundColor = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+.098+')';
					}else if(!!inkLight){
						rippleCont.style.backgroundColor = 'rgba(255,255,255,'+.098+')';
					}
				}

				setTimeout(function(){
					addClass(inkWrapper,'animate');
				},1);

				incr = icon ? rippleConfig.rippleIncremental/2 : rippleConfig.rippleIncremental;

				ink.style.opacity = inkOpacity;
				
				var inkGrow = null;

				function hoverIncrement(){
					var incrStep = ((incrmax - incr)/100)*10
					inkGrow = setInterval(function(){
						if(incr < incrmax){
							incr += incrStep;
							inkWrapper.style.height = d+incr+"px";
							inkWrapper.style.width = d+incr+"px";
						}else{
							clearInterval(inkGrow);
						}
					},50);
				}

				function listenerPress(){
					addListenerMulti(window,'mouseup blur touchend',removeInk);
					addListenerMulti(element[0],'mouseleave',removeInk);
				}
				
				function removeInk(){
					removeListenerMulti(window,'mouseup mouseleave touchend',removeInk);
					removeListenerMulti(element[0],'mouseleave',removeInk);

					clearInterval(inkGrow);

					var delay = incr <= incrmax ? rippleConfig.rippleDelay : 1;
					incr = incr < incrmax ? incrmax : incr;
					inkWrapper.style.height = d+incr+"px",
					inkWrapper.style.width = d+incr+"px",
					setTimeout(function(){
						ink.style.opacity = 0
						if(!!new RegExp('new').test(inkWrapper.className) && !icon)rippleCont.style.backgroundColor = "";
						setTimeout(function(){
							inkWrapper.remove();
							if(!!overInk && !rippleCont.querySelectorAll(".ink").length)rippleCont.style.display = "none";
						},550);
					},delay);
				}

				hoverIncrement();
				listenerPress();
			}
		}

		function parents(el,cl){
			var parents = [];
			var p = el[0].parentElement;

			while(p !== null){
				var o = p;

				if(new RegExp(cl).test(o.className))parents.push(o);
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
						  e.className = e.className.replace(new RegExp(name));
						}
					});
				}else{
					el = el[0];
					if (el.classList){
					  el.classList.remove(name);
					}else{
					  el.className = el.className.replace(new RegExp(name));
					}
				}
			}
		}

		function hasClass(e,name){
			if (e[0].classList){
			  return e[0].classList.contains(name);
			}else{
			  return new RegExp('(^| )' + name + '( |$)', 'gi').test(e[0].className);
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

			markup.innerHTML += "<div class='ripple-content'>"+content+"</div>";
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