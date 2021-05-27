```
function Promise(fn) {
    var value = null, succallbacks = [], failcallbacks = [];
    this.then = function (fulfilled, rejected) {
        succallbacks.push(fulfilled);
        failcallbacks.push(rejected);
    }

    function resolve(value) {
        setTimeout(()=>{
            console.log('resovle:'+value);
            console.log(succallbacks);
            succallbacks.forEach((callback) => {
                callback(value);
            })
        },0)
    }

    function reject(value) {
        setTimeout(()=>{
            failcallbacks.forEach((callback) => {
                callback(value);
            })
        },0)
       
    }

    fn(resolve, reject);
}
var a = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        var img = new Image();
        img.onload = function(){
            resolve(this);
        }
        img.src = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png';
        
    },1000)
});
a.then(res=>{
    console.log(res);
    document.body.appendChild(res)
}) 
```

