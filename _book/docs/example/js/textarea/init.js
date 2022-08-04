var qcanvas;
var text1;
var rect;
window.onload = function(){
    qcanvas = new Qcanvas({
      id:'qcanvas',
      width:500,
      height:500,
      mousedown:function(v,pos){
        document.getElementById('textarea').style.display = 'none';
        text1.setColor('blue'); 
      }
  });
 
rect = qcanvas.qrect.rect({
    start:[100,20],
    width:100,
    height:20,
    borderColor:'orange',
    fillColor:'#FEF8DE',
    dblclick:function(e,pos){
        var x = this.start[0];
        var y = this.start[1];
        var doc = document.getElementById('textarea');
        doc.style.top = y+'px';
        doc.style.left = x +'px';
        doc.style.width = this.width+'px';
        doc.style.height = this.height+'px';
        doc.style.fontSize="12px";
        doc.style.lineHeight="14px";
        doc.style.display = 'block'
        doc.value = text1.text;

        doc.focus(); 
        text1.setColor('#FEF8DE');

    },
    mousemove:function(){
        if(qcanvas.dragAim === null){
            return false;
        }
        text1.setStart([this.start[0],this.start[1]+3]);

    }
})
text1 = qcanvas.qtext.text({
    text:'123456',
    start:[100,23],
    fontSize:'12px', 
    lineHeight:'14px',
    color:'blue',
    textAlign:'left',
    textBaseline:'top',
    pointerEvent:'none',

    // fontFamily:'Arial'
})




}

function getWidth(v){
    return qcanvas.context.measureText(v).width;
} 
function drawText( str) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    var c = [];
    for (let i = 0; i < str.length; i++) {
      lineWidth += getWidth(str[i]); 
      
      //有换行 重新计算
      if(str[i] == '\n'){
          lineWidth = 0;
      }

      if (lineWidth > 100) {
        c.push(str.substring(lastSubStrIndex, i));//绘制截取部分
        // initHeight += 70;//60为字体的高度
        lineWidth = getWidth(str[i]);
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) {//绘制剩余部分
        c.push(str.substring(lastSubStrIndex, i + 1))
       }
    }

    text1.setText(c.join('\n')); 
    // console.log(text1.polyPoints());
    // var point = text1.polyPoints();
    // var height = point[3].y - point[0].y; 
}
function autoHeight(elem){
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }
function change(e){  
    autoHeight(e);
    rect.setHeight(parseInt(e.style.height));
    drawText(e.value);
}
