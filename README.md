# ng-ripple

Material ripple effects directive for AngularJS
### Version
0.5.0

### Dependencies
 - AngularJs
 - jQuery (soon version without)

## Installation
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

Add material button with **box-shadow**:
``` html
<ripple class="r-raised"></ripple>
```
**Icon** element:
``` html
<ripple class="r-icon"></ripple>
```
**Disabled ripple**
``` html
<ripple class="r-disabled"></ripple>
```
or **Disabled** all **element**:
``` html
<ripple class="disabled"></ripple>
```
Custom **ripple color**
``` html
<ripple r-color="#fff"></ripple>
```
Custom **ripple opacity**
``` html
<ripple r-opacity="#f00"></ripple>
```

## Angular Options
``` js
    app.run(['rippleConfig', function(rippleConfig){
		rippleConfig.rippleOpacity = .35;
		rippleConfig.rippleIncremental = 2;
	}]);
```

**Ripple Opacity** (rippleOpacity):

For all element

**Ripple Incremental** (rippleIncremental):

This is the incremental percentage of ripple radius (2 => 200% )
