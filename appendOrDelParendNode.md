```
<img id="img" src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" >

<a href="">
    <img id="img1" src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" >
</a>
```

```

window.onload = function(){


    //增加父标签
    var img = document.getElementById('img');

    var parent = img.parentNode; 
    if(parent.tagName.toLowerCase() != 'a'){
        //增加链接 
        var a = document.createElement('a');
        a.href="http://www.baidu.com";
        a.target = '_blank';
        img.parentNode.replaceChild(a,img);
        a.appendChild(img);
    }

    //删除父标签
    var img1 = document.getElementById('img1');
    img1.parentNode.parentNode.insertBefore(img1.cloneNode(true),img1.parentNode);
    img1.parentNode.parentNode.removeChild(img1.parentNode);

}
```

