# 仿有道云笔记网页剪报效果 抽取网页主内容区的算法原理

## 原理

为所有 dom （body.childNodes）节点评分，分数最高的即为主内容节点
影响某一个节点评分的因素主要有以下几项

1. 文本节点`内容不为空` 的数量及内容里的标点符号的数量
2. 文本节点内容的长度
3. 图片或 svg 的数量
4. 图片或 svg 的大小
5. 标签的 class 或 id 使用了内容区常用的一些字符串（如 content article 等） 这些是需要加分的
6. 标签的 class 或 id 使用了非内容区常用的一些字符串 （如 head foot 等）这些是需要减分的
7. 标签的位置 （比如距页面顶部都超过一屏了）这样基本就可能排除这样的节点了

### 实现过程

#### 第一步：取得所有节点

取得页面的所有 dom 节点（用递归把所有的子节点 `childNodes` 都列出来），过滤掉不需要参与评分的节点（也就是这些节点不太可能做为主内容的容器，当然也不排除极端情况，但我们只处理绝大多数）
需要过滤掉的节点有 link img i a svg style script select input textarea
还有 nodeType = 3 的内容为空的文本节点，nodeType==8 的注释节点

> 循环取得节点的同时 要统计各个评分因素的数量

#### 第二步：转化为评分

对第一步统计出来的评分因素的量转化为具体分数

#### 第三步：排序

根据评分对节点进行一次降序排序，那么取出来的第一个就是所要找的主内容节点

#### 注意：

如果要涵盖所有的网页，这个是不太可能的，对一些写得比较规范（页面结构清晰，class 和 id 名称运用也比较准确），内容所占的篇幅比较大的网页，那么选中主内容区的成功率是比较高的；反之，成功率就没那么高了；尤其是一些网页，可能是自动生成的，class 或 id 都是一些随机数，可能还存在大篇幅的广告区，成功率会更低。

总之，这种算法是个不断优化的过程。

附算法类

```


function Collect(){

	this.allNode = [];
	this.baseScore = 10;

	//不太可能做为主内容标签的 不参与评分
	this.notContentTagObj = {
		"p":1,
		"a":1,
		"i":1,
		"span":1,
		"form":1,
		"li":1,
		"ul":1,
		"ol":1,
		"input":1,
		"select":1,
		"textarea":1,
		"code":1,
		"pre":1,
		"button":1,
		"img":1,
		"h1":1,
		"h2":1,
		"h3":1,
		"h4":1,
		"h5":1,
		"h6":1,
		"meta":1,
		"link":1,
		"script":1,
		"figure":1,
		"svg":1,
		"path":1,
		"blockquote":1,
		"table":1,
		"thead":1,
		"tbody":1,
		"th":1,
		"tr":1,
		"td":1,
		"widget":1,
		"iframe":1
	};

	this.notConClassOrId = new RegExp(/(head|foot|side|comment|recommend|tag|widget)/ig);
	this.isConClassOrId = new RegExp(/(content|article)/ig);

	this.punctuationReg = new RegExp(/(\.|,|;|'|“|:|。|，|、|；|’|"|：\(|\))/g);




	//宽度小于200 不参与评分
	this.MinRangeW = 200; 

	//高度小于50 不参与评分
	this.MinRangeH = 50;

}
Collect.prototype.getPoint = function(obj) {
    var t = obj.offsetTop; //获取该元素对应父容器的上边距
    var l = obj.offsetLeft; //对应父容器的上边距
    //判断是否有父容器，如果存在则累加其边距
    while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)

    		t += obj.offsetTop; //叠加父容器的上边距
	        l += obj.offsetLeft; //叠加父容器的左边距
       
    }
 
    return {
    	top:t,
    	left:l
    }
};
Collect.prototype.getAllNode = function(dom) {
	var _this = this;
	var tmp = [];
	var innerF = function(dom){
		let child = dom.children;
		// let child = dom.childNodes;


		if(child && (child.length>0)){

			let cLen = child.length;
			for (let i = 0; i < cLen; i++) {

				 


				// console.log(child[i].tagName.toLowerCase());
				// console.log(!_this.notContentTagReg.test(child[i].tagName.toLowerCase()));

				if(
					(!_this.notContentTagObj[child[i].tagName.toLowerCase()])
					// !(_this.notContentTagReg.test(child[i].tagName.toLowerCase())) 
					&& (child[i].clientWidth > _this.MinRangeW)
					&& (child[i].clientHeight > _this.MinRangeH)


					){

					// console.log(child[i].clientWidth);
					child[i].score = _this.baseScore;
					var pos = _this.getPoint(child[i]);
					if(pos){
						child[i].domPosTop = pos.top;
						child[i].domPosLeft = pos.left;
					}
					_this.allNode.push(child[i]);
				}

					_this.getAllNode.call(_this,child[i]);
			}
		}else{
			console.log('循环完毕');
		}
	}

	innerF(dom);


};
Collect.prototype.filterNode = function() {

	var _this = this;
	var tmp = [];
	this.allNode.filter(item=>{
		console.log(item.tagName.toLowerCase());
		console.log(!_this.notContentTagReg.test(item.tagName.toLowerCase()));

		// if(!_this.notContentTagReg.test(item.tagName.toLowerCase())){
		if(

			(item.tagName.toLowerCase() !='input')

			){
			tmp.push(item);
		
		}

		// console.log(item.tagName.toLowerCase());
		// console.log(!_this.notContentTagReg.test(item.tagName.toLowerCase()));


		// return !_this.notContentTagReg.test(item.tagName.toLowerCase());

	})

	console.log(tmp);

	// this.allNode = tmp;

};
Collect.prototype.setBasicScore = function() {
	for (var i = 0; i < this.allNode.length; i++) {
		this.allNode[i].score = 10;
	}
};
Collect.prototype.isString = function(s) {
	if(Object.prototype.toString.call(s)=='[object String]'){
		return true;
	}else{
		return false;
	}
};
Collect.prototype.updateScoreByTagName_Class_Id = function() {

	for (var i = 0; i < this.allNode.length; i++) {
		if(
			this.isString(this.allNode[i].id) ||
			this.isString(this.allNode[i].className)

			){

			if(
				this.notConClassOrId.test(this.allNode[i].id.toLowerCase()) ||
				this.notConClassOrId.test(this.allNode[i].className.toLowerCase()) 


				)
			{

				this.allNode[i].score--;

			}

			if(
				this.isConClassOrId.test(this.allNode[i].id.toLowerCase()) ||
				this.isConClassOrId.test(this.allNode[i].className.toLowerCase()) 

				)
			{

				this.allNode[i].score++;

			}


		}
	}

	this.updateAllNode();


};
Collect.prototype.updateScoreByPunctuation = function() {

	var _this = this;

	var setParentScore = function(dom,score){

		if(typeof dom.score !='undefined'){
			dom.score +=score;
		}else{

			setParentScore(dom.parentElement,score);

		}

	}

	var innerF = function(dom){

		var child = dom.children;
		var len = child.length;
		var score = 0;
		for (var i = 0; i < len; i++) {
			if(typeof child[i].score == 'undefined'){

				if(child[i].innerText){
					var tmp = child[i].innerText.match(_this.punctuationReg);

					if(tmp!==null && (tmp.length >0)){
						score+= tmp.length;
					}

				}

			}
		}

		setParentScore(dom,score); //累积分数加到父级上  父级必须是有score属性的 也就是必须是在this.allNode里的
		// dom.score +=score;

		child.children && innerF(child.children);

	}

	//一直找到每个节点的没有评分的子项为止
	//没有评分的节点计算内容里的标点符号数量  累计的分数给到它的父级
	for (var i = 0; i < this.allNode.length; i++) {

		innerF(this.allNode[i]);

	}
};

Collect.prototype.updateScoreByImgOrSvg = function() {

	var _this = this;

	var setParentScore = function(dom,score){

		if(typeof dom.score !='undefined'){
			dom.score +=score;
		}else{

			setParentScore(dom.parentElement,score);

		}

	}

	var innerF = function(dom){

		var child = dom.children;
		var len = child.length;
		var imgNum = 0;
		var score = 0;
		for (var i = 0; i < len; i++) {
			if(typeof child[i].score == 'undefined'){

				if(
					 (child[i].tagName.toLowerCase()== 'img') 
					 || (child[i].tagName.toLowerCase()== 'svg') 

					){
					 if(child[i].offsetWidth > 200){
					 	imgNum++;
					 }

				}

			}
		}

		if(imgNum>2){
			score +=imgNum*6;
		}else if(imgNum>4){
			score +=imgNum*8;
		}else{
			score +=imgNum;
		}

		

		setParentScore(dom,score); //累积分数加到父级上  父级必须是有score属性的 也就是必须是在this.allNode里的
		// dom.score +=score;

		child.children && innerF(child.children);

	}
	//计算子项的图片数量 
	for (var i = 0; i < this.allNode.length; i++) {

		innerF(this.allNode[i]);

	}
	
};
Collect.prototype.updateScoreByCodeTag = function() {
	
	var _this = this;

	var setParentScore = function(dom,score){

		if(typeof dom.score !='undefined'){
			dom.score +=score;
		}else{

			setParentScore(dom.parentElement,score);

		}

	}

	var innerF = function(dom){

		var child = dom.children;
		var len = child.length;
		var score = 0;
		for (var i = 0; i < len; i++) {
			if(typeof child[i].score == 'undefined'){

				if(
					 (child[i].tagName.toLowerCase()== 'pre') 
					 || (child[i].tagName.toLowerCase()== 'code') 

					){
					 	score+=5;

				}

			}
		}

		  

		setParentScore(dom,score); //累积分数加到父级上  父级必须是有score属性的 也就是必须是在this.allNode里的
		// dom.score +=score;

		child.children && innerF(child.children);

	}
	//计算子项的图片数量 
	for (var i = 0; i < this.allNode.length; i++) {

		innerF(this.allNode[i]);

	}


};
Collect.prototype.updateByDomPosTop = function() {

	//根据距body的距离进行减分 数值越大 减得越多 以50为单位
	//
	for (var i = 0; i < this.allNode.length; i++) {
		if(this.allNode[i].domPosTop){
			this.allNode[i].score -=(this.allNode[i].domPosTop/50);
		}

	}
	
};
Collect.prototype.updateAllNode = function() {

	//小于基础分的直接过滤掉
	this.allNode = this.allNode.filter(item=>{
		return item.score>=10;
	})
	

};
Collect.prototype.sort = function(list_data,item) {
	var by = function(name,minor)
        {
            return function(o, p)
            {
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) 
            {
            a = o[name];
            b = p[name];
            if (a === b) {return typeof minor==='function' ?minor(o,p):0;}
            if (typeof a === typeof b) { return a < b ? 1 : -1;}
            return typeof a < typeof b ? -1 : 1;
            }
            else {throw ("error"); }
            }
        }
    list_data.sort(by(item)); 
};


Collect.prototype.getCoreContentArea = function() {

	var body = document.body;
	this.getAllNode(body);
	// this.filterNode();

	// this.setBasicScore();
	
	this.updateScoreByTagName_Class_Id(); 
	this.updateScoreByPunctuation();
	this.updateScoreByImgOrSvg();
	this.updateScoreByCodeTag();

	this.updateByDomPosTop();

	

	this.sort(this.allNode,'score'); 

	console.log(this.allNode);



	for (var i = 0; i < this.allNode.length; i++) {

		this.allNode[i].setAttribute('score',this.allNode[i].score);
	}
};
var co = null;
function a(){
	co = new Collect();
	co.getCoreContentArea();

	$(co.allNode[0]).css({'border':'dashed red 3px'});
	console.log(html2canvas);
	 // html2canvas(co.allNode[0], {
  //       onrendered: function(canvas) {
  //           document.body.appendChild(canvas);
  //       },
  //     width: 300,
  //     height: 300
  //   });

 //  html2canvas(co.allNode[0]).then(function(canvas) {
	//     document.body.appendChild(canvas);
	// });

chrome.runtime.sendMessage({type:'init',html: co.allNode[0].innerHTML}, function(response) {
	    console.log('收到来自pop的回复：' +response);
	    
	});
	
}


//选择不准确，舍弃该节点选择下一个
function b(){

	console.log(co);

	if(co === null){
		return false;
	}

	$(co.allNode[0]).css({'border':'dashed red 0'});

	co.allNode = co.allNode.splice(1);
	$(co.allNode[0]).css({'border':'dashed red 3px'});


	chrome.runtime.sendMessage({type:'next',html: co.allNode[0].innerHTML}, function(response) {
	    console.log('收到来自pop的回复：' +response);
	    
	});

}

function c(){

	if(co === null){
		return false;
	}

	var origin = '<br>文章来源：'+location.href;
 
	chrome.runtime.sendMessage({type:'success',html: co.allNode[0].innerHTML+origin}, function(response) {
	    console.log('收到来自pop的回复：' +response);
	    
	});
}

function clear(){
	$(co.allNode[0]).css({'border':'dashed red 0'});
	$('body').click();
}

 
```

