```
var f1 =  new Promise((resolve, reject)=>{

        setTimeout(()=>{
            console.log('f1 finished');
            resolve({
                text:'f1 promise'
            })
        },2000)

    })
var f2 =  new Promise((resolve,reject)=>{

        setTimeout(()=>{
            console.log('f2 finished')
            resolve({
                text:'f2 promise'
            })

        },2000)
    })

//并行执行
Promise.all([f1,f2]).then(()=>{ 
    console.log('callback')
})


var a = _=>{
    return new Promise((resolve,reject)=>{
        setTimeout(_=>{
            console.log('aa');
            reject('fail')
            // resolve('a->ok')
        },2000)
    })
}
var b = _=>{
    return new Promise((resolve,reject)=>{
        setTimeout(_=>{
            console.log('bb');

            resolve('b->ok')
        },1000)
    })
}
// 串行执行promise 构建队列
function queue(arr) {
    var res=[];
    var sequence = Promise.resolve();
    arr.forEach(function (item) {
        sequence = sequence.then(item).then(data=>{
                console.log(data);
                res.push(data);
                return res
       }).catch(data=>{
           //有reject也返回
           res.push(data);
           return res;
       })
    })

    return sequence
}
queue([a,b]).then(res=>{
    console.log(res);
})



```

