# ng-ripple

Material ripple effects directive for AngularJS,
Inspired by **Angular Material Design** , 
this implementation contains the ripple animation for buttons and links
### Version
1.0.2

### Dependencies
 - AngularJs

You can also use **jQuery** version

## Installation
**NPM**
```sh
$ npm install ng-ripple
```
or **Bower**
```sh
$ bower install ngRipple
```

## Examples
Various examples: [https://ng-ripple.antoniodalsie.com/](https://ng-ripple.antoniodalsie.com/)

## Options
Create directive with **Element**:

``` html
<ripple></ripple>
```

or with **Class**:


``` html
<a href="#" class="ripple"></ripple>
```

or with **Attibute**:


``` html
<a href="#" data-ripple></ripple>
```
or

``` html
<a href="#" ripple></ripple>
```

Add material button with **box-shadow**:
``` html
<ripple class="r-raised"></ripple>
```
**Icon** element:
``` html
<ripple class="r-icon"></ripple>
```
**Fab** element:
``` html
<ripple class="r-round r-raised"></ripple>
```
**Disabled ripple**
``` html
<ripple r-disabled></ripple>
```

or **Disabled active**
``` html
<ripple clas="r-int-disabled"></ripple>
```
or **Disabled** all **element**:
``` html
<ripple class="disabled"></ripple>
```
Custom **light color**
``` html
<ripple r-light></ripple>
```

Custom **ripple color**
``` html
<ripple r-color="#f00"></ripple>
```
Custom **ripple opacity**
``` html
<ripple r-opacity=".2"></ripple>
```

Ripple in-front (overink)
``` html
<ripple class="r-overink"></ripple>
```

Prevent ink for specific element and children
``` html
<ripple>
	<div class="r-noink">
		I hate ink
	</div>
	<div>
		I love ink
	</div>
</ripple>
```

Prevent ink with specific class
``` html
<ripple>
	<div class="selected" r-prevent=".selected"></div>
</ripple>
```

Ripple on click (only child element)
``` html
<ripple>
	<div class="r-noink-hover"></div>
</ripple>
```

## Angular Options
``` js
    app.run(['rippleConfig', function(rippleConfig){
		rippleConfig.rippleOpacity = .2;
		rippleConfig.rippleDelay = 100;
		rippleConfig.mobileTouch = false; // False (default): Mobile use ONLY click || True: mobile use touchstart and touchend
	}]);
```

**Ripple Opacity** (rippleOpacity):

For all element

**Ripple Incremental** (rippleDelay):

This is the delay of exit animation of ink

## Changelog
Version 1.0.2:

Fix duplication ng-* directive

Version 1.0.1:

Fix and new options

Version 1.0.0:

Fix standalone, recreate ripple effects

Version 0.9.6:

Fix for Safari and Chrome 51 (Animation Bug)

Version 0.9.5:

Re-created animation of ink and general fix

Version 0.9.4:

Added **r-overink** for big element, added **r-noink** (prevent ink generation when you click a specific element)

Version 0.9.3:

Fix overflow ink problem

Version 0.9.1:

Fix disabled option.

Version 0.9.0:

Add **standalone version**.

Version 0.5.1:

Add **Fab** option.
