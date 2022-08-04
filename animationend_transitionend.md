```
var aniEndName = (function() {
        var eleStyle = document.createElement('div').style;
        var verdors = ['a', 'webkitA', 'MozA', 'OA', 'msA'];
        var endEvents = ['animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd'];
        var animation;
        for (var i = 0, len = verdors.length; i < len; i++) {
            animation = verdors[i] + 'nimation';
            if (animation in eleStyle) {
                return endEvents[i];
            }
        }
        return 'animationend';
 }());

var tranEndName = (function() {
        var eleStyle = document.createElement('div').style;
        var verdors = ['a', 'webkitA', 'MozA', 'OA', 'msA'];
        var endEvents = ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd'];
        var animation;
        for (var i = 0, len = verdors.length; i < len; i++) {
            animation = verdors[i] + 'nimation';
            if (animation in eleStyle) {
                return endEvents[i];
            }
        }
        return 'transitionend';
 }());

function animationed(obj,callback){ 
	obj.addEventListener(aniEndName, callback); 	
	
}

function transitionend(obj,callback){ 
	obj.addEventListener(tranEndName, callback);
}

//使用示例
	animationed($('#title2')[0],function(){})

```