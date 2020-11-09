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


Promise.all([f1,f2]).then(()=>{ 
    console.log('callback')
})
```

