//打字机效果
var initTxt = {

	init:function(id){

		var t = $('#'+id).html();
		var txts = t.split(/<span.*?>.*?<\/span>/g);
	    var spans = t.match(/<span.*?>.*?<\/span>/g);


	     //纯文字用i标签包含起来
	 	txts = txts.filter(function(item){
	    	return item !='';
	    })
     	
	    var map = {};
     	txts.forEach(function(item){
     		var tmp  = item.split('');
     		var t = '';
	     	tmp.forEach(c=>{
	     		t+= '<i>'+c+'</i>';
	     	})
	     	map[item] = t;
     	}) 


	    //在span标签内的文字也用i标签包含起来
     	spans!==null && spans.forEach(function(span){
    		var txt = span.replace(/<span.*?>/g,'').replace(/<\/span>/g,'');
    		var tmp = txt.split('');
    		var t = '';
    		tmp.forEach(function(c){
    			t +='<i>'+c+'</i>';
    		})
    		map[span] = span.replace(txt,t);
    	})



     	//替换为新的字符串
     	for(var i in map){
     		(function(s){
     			t = t.replace(s,map[s]);

     		})(i)
     	}

	 	$('#'+id).html(t);
	},
	start:function(id,callBack){	

		var wordsNum = $('#'+id+' i').length;

 		var innter = function(t){

 			if(t == wordsNum){
 				callBack && callBack();
 				return false
 			}

 			$('#'+id+' i').eq(t).addClass('show')
 			setTimeout(function(){
 				t++;
 				innter(t);
 			},80)
 		}

 		innter(0)

	}
}